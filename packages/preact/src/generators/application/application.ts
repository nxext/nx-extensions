import {
  formatFiles,
  generateFiles,
  joinPathFragments,
  names,
  offsetFromRoot,
  Tree,
  runTasksInSerial,
} from '@nx/devkit';
import {
  addCypressApplication,
  addEslintLintProject,
  addJestConfiguration,
  addViteApplication,
  configureViteFrameworkPlugin,
  normalizeViteAppCore,
  wireTsSolutionProject,
} from '@nxext/common';
import { NormalizedSchema, PreactApplicationSchema } from './schema';
import { addProject } from './lib/add-project';
import { initGenerator } from '../init/init';
import { updateJestConfig } from './lib/update-jest-config';
import { extraEslintDependencies } from '../utils/lint';
import { preactViteFrameworkConfig } from '../utils/vite-config';

async function normalizeOptions(
  tree: Tree,
  options: PreactApplicationSchema,
): Promise<NormalizedSchema> {
  const core = await normalizeViteAppCore(
    tree,
    {
      name: options.name,
      directory: options.directory,
      tags: options.tags,
      // preact's schema has no `rootProject` option -> always undefined,
      // which reproduces today's hardcoded "non-root" behavior.
      rootProject: undefined,
    },
    'application',
  );

  // fileName stays a local computation (kept in sync with the
  // `projectFileName` logic from `determineProjectNameAndRootOptions`),
  // since `normalizeViteAppCore` intentionally doesn't expose it.
  const fileName = core.projectName.startsWith('@')
    ? core.projectName.split('/').slice(1).join('-')
    : core.projectName;

  return {
    ...options,
    // preact keeps `name` un-normalized (raw project name, no casing).
    name: core.projectName,
    projectRoot: core.projectRoot,
    parsedTags: core.parsedTags,
    e2eWebServerTarget: core.e2eWebServerTarget,
    e2eWebServerAddress: core.e2eWebServerAddress,
    e2eProjectName: core.e2eProjectName,
    e2eProjectRoot: core.e2eProjectRoot,
    fileName,
    projectDirectory: core.projectRoot,
    skipFormat: false,
    importPath: core.importPath,
    isUsingTsSolutionConfig: core.isUsingTsSolutionConfig,
    // Nx pattern (react/vue `normalize-options.js`): default is the exact
    // negation of the TS-solution flag. Not exposed as a user-facing CLI
    // option here - see report for the scope rationale.
    useProjectJson: !core.isUsingTsSolutionConfig,
  };
}

function createFiles(host: Tree, options: NormalizedSchema) {
  const substitutions = {
    ...options,
    ...names(options.name),
    offsetFromRoot: offsetFromRoot(options.projectRoot),
  };

  // Files identical in both modes (Design 3.2): framework source, the
  // runtime tsconfigs. tsconfig.app.json/tsconfig.spec.json already extend
  // `./tsconfig.json` in both modes and don't need to know which mode is
  // active - `wireTsSolutionProject` (below) patches their `extends`/
  // compilerOptions programmatically once they're on disk.
  generateFiles(
    host,
    joinPathFragments(__dirname, './files/common'),
    options.projectRoot,
    substitutions,
  );

  // `package.json` and the per-project wrapper `tsconfig.json` are the only
  // files that genuinely differ by mode:
  // - `package.json`: in TS-solution mode it's already been written by
  //   `addProjectPackageJson` (called from `addProject`, before this
  //   function runs) as the authoritative source - copying a static
  //   template on top here would silently clobber that, so the
  //   `ts-solution/` directory simply has no `package.json.template`.
  // - `tsconfig.json`: legacy keeps today's JSX-laden wrapper unchanged;
  //   TS-solution uses a thin references-only pointer instead, since
  //   `wireTsSolutionProject` rewrites tsconfig.app.json/tsconfig.spec.json
  //   to extend the root tsconfig.base.json directly (bypassing this
  //   wrapper for compilation) and carries the JSX compilerOptions there.
  generateFiles(
    host,
    joinPathFragments(
      __dirname,
      './files',
      options.isUsingTsSolutionConfig ? 'ts-solution' : 'non-ts-solution',
    ),
    options.projectRoot,
    substitutions,
  );

  host.delete(joinPathFragments(`${options.projectRoot}/public/index.html`));
}

export async function applicationGenerator(
  tree: Tree,
  schema: PreactApplicationSchema,
) {
  const options = await normalizeOptions(tree, schema);

  const initTask = await initGenerator(tree, { ...options, skipFormat: true });

  addProject(tree, options);
  createFiles(tree, options);

  if (options.isUsingTsSolutionConfig) {
    // The runtime tsconfig.app.json must already exist on disk (written by
    // createFiles above) before `updateTsconfigFiles` can patch it - see
    // Design 1.3/`@nxext/common`'s `wireTsSolutionProject`. JSX settings
    // mirror the values already baked into
    // `files/non-ts-solution/tsconfig.json.template` (classic preact
    // runtime: `jsxFactory: 'h'`, not the automatic `react-jsx` transform) -
    // they move onto the runtime tsconfig.app.json here since the
    // TS-solution wrapper tsconfig.json is now a thin references-only file.
    await wireTsSolutionProject(
      tree,
      options.projectRoot,
      'tsconfig.app.json',
      {
        module: 'esnext',
        moduleResolution: 'bundler',
        resolveJsonModule: true,
        jsx: 'preserve',
        jsxFactory: 'h',
        jsxFragmentFactory: 'Fragment',
        jsxImportSource: 'preact',
        allowSyntheticDefaultImports: true,
        esModuleInterop: true,
        types: ['vite/client'],
      },
    );
  }

  const viteTask = await addViteApplication(tree, {
    projectName: options.name,
    unitTestRunner: options.unitTestRunner,
  });
  configureViteFrameworkPlugin(
    tree,
    {
      project: options.name,
      includeLib: false,
      includeVitest: options.unitTestRunner === 'vitest',
    },
    preactViteFrameworkConfig,
  );

  const lintTask = await addEslintLintProject(
    tree,
    {
      linter: options.linter,
      projectName: options.name,
      projectRoot: options.projectRoot,
      tsConfigFileName: 'tsconfig.app.json',
    },
    extraEslintDependencies,
  );
  const jestTask = await addJestConfiguration(tree, {
    projectName: options.name,
    unitTestRunner: options.unitTestRunner,
  });
  const cypressTask = await addCypressApplication(tree, {
    projectName: options.name,
    e2eTestRunner: options.e2eTestRunner,
    e2eProjectName: options.e2eProjectName,
    e2eProjectRoot: options.e2eProjectRoot,
    e2eWebServerAddress: options.e2eWebServerAddress,
    e2eWebServerTarget: options.e2eWebServerTarget,
  });
  updateJestConfig(tree, options);

  if (!options.skipFormat) {
    await formatFiles(tree);
  }

  return runTasksInSerial(initTask, viteTask, lintTask, jestTask, cypressTask);
}

export default applicationGenerator;
