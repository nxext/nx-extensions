import { join, dirname } from 'path';
import {
  mkdirSync,
  readdirSync,
  rmSync,
  existsSync,
  readFileSync,
  renameSync,
  unlinkSync,
  writeFileSync,
} from 'fs';
import { execSync, exec, ExecOptions } from 'child_process';
import { homedir, tmpdir } from 'os';
import { promisify } from 'util';

const execAsync = promisify(exec);

const E2E_ENV: NodeJS.ProcessEnv = {
  ...process.env,
  NX_NO_CLOUD: 'true',
  NX_DAEMON: 'false',
  CI: 'true',
  // Pin create-nx-workspace's A/B flow variant for deterministic scaffolds.
  NX_CNW_FLOW_VARIANT: '0',
  NPM_CONFIG_IGNORE_WORKSPACE_ROOT_CHECK: 'true',
};

/**
 * Every e2e run republishes the SAME `0.0.1-e2e` version (with different
 * contents) to a fresh Verdaccio on localhost. pnpm keeps a machine-global
 * registry-metadata cache (e.g. `~/Library/Caches/pnpm/metadata/<host>/...`
 * on macOS, `~/.cache/pnpm/...` on Linux) with `cachedAt`-based freshness:
 * as long as the cached packument already contains the requested version,
 * pnpm never re-asks the registry. A packument cached by a PREVIOUS e2e run
 * therefore silently resolves `0.0.1-e2e` to an OUTDATED tarball
 * (observed: `@nxext/common@0.0.1-e2e` from an older run, missing newer
 * exports, failing every generator). pnpm 11 has no CLI to drop single
 * metadata entries, so delete the `@nxext` packuments for local registries
 * directly - they are transient cache state and repopulate from the
 * freshly seeded Verdaccio on the next install.
 */
function purgeStaleLocalRegistryMetadata(): void {
  const cacheRoots = [
    process.env.XDG_CACHE_HOME
      ? join(process.env.XDG_CACHE_HOME, 'pnpm')
      : undefined,
    join(homedir(), 'Library', 'Caches', 'pnpm'), // macOS
    join(homedir(), '.cache', 'pnpm'), // Linux
    process.env.LOCALAPPDATA
      ? join(process.env.LOCALAPPDATA, 'pnpm-cache')
      : undefined, // Windows
  ].filter((root): root is string => !!root && existsSync(root));

  for (const cacheRoot of cacheRoots) {
    for (const entry of readdirSync(cacheRoot)) {
      if (!entry.startsWith('metadata')) continue;
      const metadataDir = join(cacheRoot, entry);
      for (const host of readdirSync(metadataDir)) {
        if (!host.startsWith('localhost+')) continue;
        rmSync(join(metadataDir, host, '@nxext'), {
          recursive: true,
          force: true,
        });
      }
    }
  }
}

export interface CreateTestProjectOptions {
  /**
   * Opt into leaving the workspace in the (Nx 21+ default) TS-solution
   * shape instead of downgrading it to the legacy apps-libs layout.
   * Default `false`: every existing suite keeps scaffolding a legacy
   * workspace, unchanged. See Design 3.4 / the P2-Phase-2 report for the
   * rationale (migration is per-plugin/per-suite, not a global flip).
   */
  tsSolution?: boolean;
}

/**
 * Scaffolds a throwaway Nx workspace outside the host repo to avoid clashes with the
 * host's .gitignore / git repo. Returns the absolute path to the workspace root.
 */
export function createTestProject(
  projectName = 'proj',
  opts: CreateTestProjectOptions = {},
): string {
  const root = join(
    tmpdir(),
    `nxext-e2e-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
  );
  const projectDirectory = join(root, projectName);

  mkdirSync(root, { recursive: true });

  // `--useProjectJson=true --workspaceType=integrated` force the legacy
  // project.json layout even though `create-nx-workspace` defaults to the
  // TS-solution shape since Nx 21/22. The TS-solution path below needs the
  // plain defaults instead (package-manager workspaces + package.json
  // projects), so these two flags are legacy-only.
  // `--preset=apps` output is machine-dependent (create-nx-workspace rolls
  // an A/B flow variant per machine and detects installed AI tooling), so
  // the TS-solution path pins the canonical `ts` preset instead.
  const preset = opts.tsSolution ? 'ts' : 'apps';
  const createWorkspaceFlags = opts.tsSolution
    ? ''
    : ' --workspaceType=integrated --useProjectJson=true';

  execSync(
    `npx --yes create-nx-workspace@latest ${projectName} --preset=${preset} --nxCloud=skip --no-interactive --packageManager=pnpm${createWorkspaceFlags}`,
    {
      cwd: root,
      stdio: 'inherit',
      env: E2E_ENV,
    },
  );

  if (!opts.tsSolution) {
    downgradeToLegacyWorkspace(projectDirectory);

    // `create-nx-workspace@latest` pulls whatever `typescript` is currently
    // latest on npm, with no version constraint. TypeScript's `ignoreDeprecations`
    // literal (below, in downgradeToLegacyWorkspace) tracks the installed major —
    // "5.0" only silences the moduleResolution/baseUrl deprecation on TS 5.x; a
    // fresh TS 6.x install demands "6.0" instead, and there is no single literal
    // that satisfies both. Pin to the range every @nxext/* package's peerDependencies
    // already declare so the resolved compiler matches what a real install gets.
    execSync(`pnpm add -D typescript@^5.7.3`, {
      cwd: projectDirectory,
      stdio: 'inherit',
      env: E2E_ENV,
    });
  }
  // TS-solution path: deliberately NOT pinning up front (see P2-Phase-2
  // report for the empirical check this reflects - `create-nx-workspace`
  // resolves `typescript` to a 6.0.x release here too, which is outside
  // every @nxext/* package's declared peerDependencies range, but `pnpm
  // add` only warns rather than failing on a peer mismatch, so whether the
  // pin is actually needed is decided by whether generation/build actually
  // breaks under it, not by the install step alone).

  console.log(`Created test project in "${projectDirectory}"`);
  return projectDirectory;
}

/**
 * Nx 22's `create-nx-workspace` emits a TS-solution workspace:
 * - `pnpm-workspace.yaml`
 * - `tsconfig.json` that extends `tsconfig.base.json` with an empty `files:[]`
 * - `tsconfig.base.json` with `customConditions` (requires node16/nodenext/bundler moduleResolution)
 *
 * Every @nxext/* generator still guards against that layout with
 * `assertNotUsingTsSolutionSetup`, and even after bypassing the guard the
 * generated `tsconfig.app.json` fails to compile because `customConditions`
 * clashes with the stencil-emitted moduleResolution.
 *
 * Flatten the workspace back to the pre-Nx-22 shape expected by the plugins.
 */
function downgradeToLegacyWorkspace(projectDirectory: string): void {
  const workspaceYaml = join(projectDirectory, 'pnpm-workspace.yaml');
  if (existsSync(workspaceYaml)) unlinkSync(workspaceYaml);

  const tsconfigJson = join(projectDirectory, 'tsconfig.json');
  if (existsSync(tsconfigJson)) unlinkSync(tsconfigJson);

  writeFileSync(
    join(projectDirectory, 'tsconfig.base.json'),
    JSON.stringify(
      {
        compileOnSave: false,
        compilerOptions: {
          rootDir: '.',
          sourceMap: true,
          declaration: false,
          moduleResolution: 'node',
          // TS 5.9+ deprecated the legacy `node` resolution and `baseUrl`
          // (still required by @nxext generators' emitted moduleResolution)
          // in favor of bundler/node16/nodenext; silence rather than migrate,
          // since that's the whole point of this legacy-shape downgrade.
          // "5.0" is the only value TypeScript currently accepts here — it's
          // a fixed literal tied to the deprecation cycle, not a version knob.
          ignoreDeprecations: '5.0',
          emitDecoratorMetadata: true,
          experimentalDecorators: true,
          importHelpers: true,
          target: 'es2022',
          module: 'esnext',
          lib: ['es2020', 'dom'],
          types: ['vite/client'],
          skipLibCheck: true,
          skipDefaultLibCheck: true,
          baseUrl: '.',
          paths: {},
        },
        exclude: ['node_modules', 'tmp'],
      },
      null,
      2,
    ) + '\n',
  );
}

/**
 * Removes a workspace created by `createTestProject`. Safe to call with undefined.
 */
export function cleanupTestProject(projectDirectory: string | undefined): void {
  if (!projectDirectory || !existsSync(projectDirectory)) return;
  rmSync(dirname(projectDirectory), { recursive: true, force: true });
}

/**
 * Installs an `@nxext/<pluginName>` package into the test project from the local Verdaccio.
 * The plugin is published under the `e2e` npm tag by `tools/scripts/start-local-registry.ts`.
 *
 * Purges pnpm's machine-global metadata cache for `@nxext/*` on local
 * registries first - see `purgeStaleLocalRegistryMetadata` for why a stale
 * packument from a previous e2e run would otherwise silently pin
 * `0.0.1-e2e` to an outdated tarball.
 */
export function installPlugin(
  projectDirectory: string,
  pluginName: string,
): void {
  purgeStaleLocalRegistryMetadata();

  execSync(`pnpm add -D @nxext/${pluginName}@e2e`, {
    cwd: projectDirectory,
    stdio: 'inherit',
    env: E2E_ENV,
  });
}

/**
 * Installs one or more first-party Nx plugins (e.g. `@nx/angular`, `@nx/web`)
 * into the test project. Needed for the ionic/capacitor e2e suites that layer
 * their configuration on top of a base-framework application generator which
 * `create-nx-workspace --preset=apps` does not ship by default.
 */
export function installNxPlugins(
  projectDirectory: string,
  packages: string[],
): void {
  if (packages.length === 0) return;
  execSync(`pnpm add -D ${packages.join(' ')}`, {
    cwd: projectDirectory,
    stdio: 'inherit',
    env: E2E_ENV,
  });
}

export type RunNxCommandResult = { stdout: string; stderr: string };

/**
 * Runs `nx <command>` in the given project directory. Matches the shape of
 * `@nx/plugin/testing#runNxCommandAsync` but takes an explicit cwd so the
 * workspace can live outside the host repo.
 */
export async function runNxCommandAsync(
  projectDirectory: string,
  command: string,
  options: Omit<ExecOptions, 'cwd' | 'env'> = {},
): Promise<RunNxCommandResult> {
  try {
    const { stdout, stderr } = await execAsync(`pnpm exec nx ${command}`, {
      ...options,
      cwd: projectDirectory,
      env: E2E_ENV,
      encoding: 'utf-8',
      maxBuffer: 1024 * 1024 * 10,
    });
    return { stdout: stdout.toString(), stderr: stderr.toString() };
  } catch (err) {
    const e = err as { stdout?: string; stderr?: string; message: string };
    throw new Error(
      `\`nx ${command}\` failed in ${projectDirectory}\n---stdout---\n${
        e.stdout ?? ''
      }\n---stderr---\n${e.stderr ?? ''}\n---\n${e.message}`,
    );
  }
}

/**
 * Synchronous fire-and-forget command in the test workspace.
 */
export function runCommand(
  projectDirectory: string,
  command: string,
  options: Omit<ExecOptions, 'cwd' | 'env'> = {},
): string {
  return execSync(command, {
    ...options,
    cwd: projectDirectory,
    env: E2E_ENV,
    encoding: 'utf-8',
  }).toString();
}

export function checkFilesExist(
  projectDirectory: string,
  ...filePaths: string[]
): void {
  for (const filePath of filePaths) {
    if (!existsSync(join(projectDirectory, filePath))) {
      throw new Error(`Expected file to exist: ${filePath}`);
    }
  }
}

export function renameFile(
  projectDirectory: string,
  from: string,
  to: string,
): void {
  renameSync(join(projectDirectory, from), join(projectDirectory, to));
}

export function readJson<T = unknown>(
  projectDirectory: string,
  relativePath: string,
): T {
  return JSON.parse(
    readFileSync(join(projectDirectory, relativePath), 'utf-8'),
  ) as T;
}

export function readFile(
  projectDirectory: string,
  relativePath: string,
): string {
  return readFileSync(join(projectDirectory, relativePath), 'utf-8');
}

/**
 * Reads the workspace package globs of a TS-solution test workspace -
 * `pnpm-workspace.yaml` when present, otherwise `package.json#workspaces` -
 * mirroring the exact precedence Nx's own `addProjectToTsSolutionWorkspace`
 * (`@nx/workspace/src/utilities/typescript/ts-solution-setup.js`) uses when
 * registering a newly generated project: pnpm-workspace.yaml if the
 * workspace has one, `package.json#workspaces` otherwise.
 *
 * `create-nx-workspace --packageManager=pnpm` emits the former on most
 * platforms, but has been observed to emit the latter instead for the exact
 * same flag on some CI runners - reading through this helper (instead of
 * hardcoding `pnpm-workspace.yaml`) keeps e2e assertions correct either way.
 *
 * The YAML parsing is intentionally minimal - it only understands the shape
 * `addProjectToTsSolutionWorkspace` actually produces via `@zkochan/js-yaml`'s
 * `dump(..., { quotingType: '"', forceQuotes: true })`: a top-level
 * `packages:` key followed by `- "glob"` (or `- 'glob'` / unquoted) list
 * items. That's enough for these e2e suites - no YAML package dependency
 * needed.
 */
export function readWorkspaceGlobs(projectDirectory: string): string[] {
  const workspaceYamlPath = join(projectDirectory, 'pnpm-workspace.yaml');
  if (existsSync(workspaceYamlPath)) {
    const contents = readFileSync(workspaceYamlPath, 'utf-8');
    const globs: string[] = [];
    let inPackages = false;
    for (const line of contents.split(/\r?\n/)) {
      if (/^packages:\s*$/.test(line)) {
        inPackages = true;
        continue;
      }
      if (!inPackages) continue;
      const item = line.match(/^\s+-\s*(?:"([^"]*)"|'([^']*)'|(.+?))\s*$/);
      if (item) {
        globs.push((item[1] ?? item[2] ?? item[3]) as string);
        continue;
      }
      if (line.trim() !== '') {
        // A non-list-item, non-blank line ends the `packages:` block.
        inPackages = false;
      }
    }
    return globs;
  }

  const packageJson = readJson<{ workspaces?: string[] }>(
    projectDirectory,
    'package.json',
  );
  return packageJson.workspaces ?? [];
}

/**
 * Writes `contents` to a file in the test project, creating parent dirs if
 * needed. `contents` may be a string or a callback that receives the current
 * contents and returns the updated string — matching the
 * `@nx/plugin/testing#updateFile` signature.
 */
export function updateFile(
  projectDirectory: string,
  relativePath: string,
  contents: string | ((current: string) => string),
): void {
  const absolute = join(projectDirectory, relativePath);
  mkdirSync(dirname(absolute), { recursive: true });
  const next =
    typeof contents === 'function'
      ? contents(existsSync(absolute) ? readFileSync(absolute, 'utf-8') : '')
      : contents;
  writeFileSync(absolute, next);
}

export function uniq(prefix: string): string {
  return `${prefix}${Math.floor(Math.random() * 10_000_000)}`;
}

export function stripAnsi(value: string): string {
  return value.replace(
    /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g,
    '',
  );
}
