import { join, dirname } from 'path';
import {
  mkdirSync,
  rmSync,
  existsSync,
  renameSync,
  unlinkSync,
  writeFileSync,
} from 'fs';
import { execSync, exec, ExecOptions } from 'child_process';
import { tmpdir } from 'os';
import { promisify } from 'util';

export { runNxCommandUntil } from './run-commands-until';

const execAsync = promisify(exec);

const E2E_ENV: NodeJS.ProcessEnv = {
  ...process.env,
  NX_NO_CLOUD: 'true',
  NX_DAEMON: 'false',
  CI: 'true',
  NPM_CONFIG_IGNORE_WORKSPACE_ROOT_CHECK: 'true',
};

/**
 * Scaffolds a throwaway Nx workspace outside the host repo to avoid clashes with the
 * host's .gitignore / git repo. Returns the absolute path to the workspace root.
 */
export function createTestProject(projectName = 'proj'): string {
  const root = join(
    tmpdir(),
    `nxext-e2e-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
  );
  const projectDirectory = join(root, projectName);

  mkdirSync(root, { recursive: true });

  execSync(
    `npx --yes create-nx-workspace@latest ${projectName} --preset=apps --nxCloud=skip --no-interactive --packageManager=pnpm --workspaceType=integrated --useProjectJson=true`,
    {
      cwd: root,
      stdio: 'inherit',
      env: E2E_ENV,
    }
  );

  downgradeToLegacyWorkspace(projectDirectory);

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
          emitDecoratorMetadata: true,
          experimentalDecorators: true,
          importHelpers: true,
          target: 'es2022',
          module: 'esnext',
          lib: ['es2020', 'dom'],
          skipLibCheck: true,
          skipDefaultLibCheck: true,
          baseUrl: '.',
          paths: {},
        },
        exclude: ['node_modules', 'tmp'],
      },
      null,
      2
    ) + '\n'
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
 */
export function installPlugin(
  projectDirectory: string,
  pluginName: string
): void {
  execSync(`pnpm add -D @nxext/${pluginName}@e2e`, {
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
  options: Omit<ExecOptions, 'cwd' | 'env'> = {}
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
      }\n---stderr---\n${e.stderr ?? ''}\n---\n${e.message}`
    );
  }
}

/**
 * Synchronous fire-and-forget command in the test workspace.
 */
export function runCommand(
  projectDirectory: string,
  command: string,
  options: Omit<ExecOptions, 'cwd' | 'env'> = {}
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
  to: string
): void {
  renameSync(join(projectDirectory, from), join(projectDirectory, to));
}

export function uniq(prefix: string): string {
  return `${prefix}${Math.floor(Math.random() * 10_000_000)}`;
}

export function stripAnsi(value: string): string {
  return value.replace(
    /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g,
    ''
  );
}
