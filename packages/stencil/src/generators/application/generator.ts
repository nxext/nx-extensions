import { AppType } from './../../utils/typings';
import {
  formatFiles,
  generateFiles,
  names,
  offsetFromRoot,
  Tree,
  runTasksInSerial,
  readNxJson,
} from '@nx/devkit';
import { initGenerator as jsInitGenerator } from '@nx/js';
import { ApplicationSchema, RawApplicationSchema } from './schema';
import { calculateStyle } from '../../utils/utillities';
import { initGenerator } from '../init/init';
import { join } from 'path';
import { EOL } from 'node:os';
import { addProject } from './lib/add-project';
import { addLinting } from './lib/add-linting';
import { addCypress } from './lib/add-cypress';
import {
  determineProjectNameAndRootOptions,
  ensureRootProjectName,
  logShowProjectCommand,
} from '@nx/devkit/internal';
import { isUsingTsSolutionSetup, wireTsSolutionProject } from '@nxext/common';

// Stencil-specific compilerOptions Stencil's own JSX pragma (`h`) needs -
// unrelated to React/Solid's `jsx`/`jsxImportSource` runtime conventions
// (Design 3.3: "stencil nutzt eigene JSX-Typen via @stencil/core"). Applied
// identically in both modes: in legacy mode they're baked into the
// project's outer `tsconfig.json` (see `files/non-ts-solution`), in
// TS-solution mode they're applied directly onto `tsconfig.app.json` by
// `wireTsSolutionProject` since the outer `tsconfig.json` becomes a thin
// references-only wrapper (Design 3.2, mirrors `files/ts-solution`).
const STENCIL_APP_TSCONFIG_COMPILER_OPTIONS = {
  allowSyntheticDefaultImports: true,
  allowUnreachableCode: false,
  declaration: false,
  experimentalDecorators: true,
  lib: ['dom', 'es2015'],
  moduleResolution: 'node',
  module: 'esnext',
  target: 'es2017',
  noUnusedLocals: true,
  noUnusedParameters: true,
  jsx: 'react',
  jsxFactory: 'h',
};

async function normalizeOptions(
  host: Tree,
  options: RawApplicationSchema,
): Promise<ApplicationSchema> {
  await ensureRootProjectName(options, 'application');
  const {
    projectName: resolvedProjectName,
    projectRoot,
    importPath,
  } = await determineProjectNameAndRootOptions(host, {
    name: options.name,
    projectType: 'application',
    directory: options.directory,
    importPath: options.importPath,
  });

  const isUsingTsSolutionConfig = isUsingTsSolutionSetup(host);
  // Design 1.5 (mirrors @nxext/common's normalizeViteAppCore/@nx/react):
  // without an explicit --name, the Nx project identifier defaults to the
  // full scoped importPath in TS-solution mode.
  const projectName =
    !isUsingTsSolutionConfig || options.name
      ? resolvedProjectName
      : importPath;
  options.name ??= projectName;

  const parsedTags = options.tags
    ? options.tags.split(',').map((s) => s.trim())
    : [];

  const nxJson = readNxJson(host);

  const e2eWebServerTarget = 'serve';
  let e2ePort = 4200;
  if (
    nxJson.targetDefaults?.[e2eWebServerTarget] &&
    nxJson.targetDefaults?.[e2eWebServerTarget].options?.port
  ) {
    e2ePort = nxJson.targetDefaults?.[e2eWebServerTarget].options?.port;
  }

  const e2eProjectName = `${projectName}-e2e`;
  const e2eProjectRoot = `${projectRoot}-e2e`;
  const e2eWebServerAddress = `http://localhost:${e2ePort}`;

  const style = calculateStyle(options.style);

  const appType = AppType.application;

  return {
    ...options,
    name: projectName,
    projectName,
    projectRoot,
    projectDirectory: projectRoot,
    parsedTags,
    e2eProjectName,
    e2eProjectRoot,
    e2eWebServerAddress,
    e2eWebServerTarget,
    style,
    appType,
    importPath,
    // Always the plain, pre-importPath-substitution name (see schema doc).
    simpleProjectName: resolvedProjectName,
    isUsingTsSolutionConfig,
    useProjectJson: !isUsingTsSolutionConfig,
  };
}

function createFiles(host: Tree, options: ApplicationSchema) {
  const substitutions = {
    ...options,
    ...names(options.name),
    offsetFromRoot: offsetFromRoot(options.projectRoot),
  };

  // Files identical in both modes (Design 3.2): app source, stencil config,
  // the runtime tsconfigs (tsconfig.app.json's TS-solution-specific
  // `extends`/compilerOptions divergence is applied programmatically
  // afterwards by `wireTsSolutionProject`, see applicationGenerator below).
  generateFiles(
    host,
    join(__dirname, './files/common'),
    options.projectRoot,
    substitutions,
  );

  // The outer `tsconfig.json` is the one file that genuinely differs by
  // mode: legacy mode bakes Stencil's JSX compilerOptions into it (extended
  // by tsconfig.app.json); TS-solution mode keeps it a thin
  // references-only pointer (mirrors @nxext/svelte/@nxext/sveltekit -
  // Design 3.2).
  generateFiles(
    host,
    join(
      __dirname,
      options.isUsingTsSolutionConfig ? './files/ts-solution' : './files/non-ts-solution',
    ),
    options.projectRoot,
    substitutions,
  );

  if (options.unitTestRunner === 'none') {
    host.delete(
      `${options.projectRoot}/src/components/app-home/app-home.spec.ts`,
    );
    host.delete(
      `${options.projectRoot}/src/components/app-root/app-root.spec.ts`,
    );
    host.delete(
      `${options.projectRoot}/src/components/app-profile/app-profile.spec.ts`,
    );
  }

  if (options.e2eTestRunner === 'none') {
    host.delete(
      `${options.projectRoot}/src/components/app-home/app-home.e2e.ts`,
    );
    host.delete(
      `${options.projectRoot}/src/components/app-root/app-root.e2e.ts`,
    );
    host.delete(
      `${options.projectRoot}/src/components/app-profile/app-profile.e2e.ts`,
    );
  }
}

export async function applicationGenerator(
  host: Tree,
  schema: RawApplicationSchema,
) {
  const options = await normalizeOptions(host, schema);

  const jsInitTask = await jsInitGenerator(host, {
    ...options,
    tsConfigName: 'tsconfig.base.json',
    skipFormat: true,
  });

  const initTask = await initGenerator(host, {
    ...options,
    skipFormat: true,
  });

  createFiles(host, options);
  addProject(host, options);

  if (options.isUsingTsSolutionConfig) {
    // The runtime tsconfig.app.json must already exist on disk (written by
    // createFiles above) before `updateTsconfigFiles` can patch it - see
    // Design 1.3/`@nxext/common`'s `wireTsSolutionProject`. Must also run
    // AFTER `addProject`: this project is package.json-backed (no
    // project.json) in TS-solution mode, and `addLinting` below resolves
    // the project via the project graph, which depends on the
    // pnpm-workspace.yaml registration `wireTsSolutionProject` performs.
    await wireTsSolutionProject(
      host,
      options.projectRoot,
      'tsconfig.app.json',
      STENCIL_APP_TSCONFIG_COMPILER_OPTIONS,
    );
  }

  const lintTask = await addLinting(host, options);
  const cypressTask = await addCypress(host, options);

  const ignoresToUpdate = ['.gitignore', '.prettierignore', '.nxignore'];
  const toBeIgnored = ['.stencil'].join(EOL);
  ignoresToUpdate.forEach((ignoreFile) => {
    if (host.exists(ignoreFile)) {
      const gitignoreContent = host.read(ignoreFile, 'utf-8');
      if (!gitignoreContent.includes('.stencil')) {
        host.write(
          ignoreFile,
          `${gitignoreContent}

${toBeIgnored}
`,
        );
      }
    }
  });

  if (!options.skipFormat) {
    await formatFiles(host);
  }

  return runTasksInSerial(jsInitTask, initTask, lintTask, cypressTask, () =>
    logShowProjectCommand(options.projectName),
  );
}

export default applicationGenerator;
