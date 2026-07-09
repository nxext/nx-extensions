import {
  formatFiles,
  generateFiles,
  joinPathFragments,
  names,
  offsetFromRoot,
  runTasksInSerial,
  Tree,
} from '@nx/devkit';
import { LibrarySchema, RawLibrarySchema } from './schema';
import { AppType } from '../../utils/typings';
import { calculateStyle } from '../../utils/utillities';
import { initGenerator } from '../../generators/init/init';
import { MakeLibBuildableSchema } from '../../generators/make-lib-buildable/schema';
import { addProject } from './lib/add-project';
import { makeLibBuildableGenerator } from '../../generators/make-lib-buildable/make-lib-buildable';
import {
  determineProjectNameAndRootOptions,
  ensureRootProjectName,
  logShowProjectCommand,
} from '@nx/devkit/internal';
import { initGenerator as jsInitGenerator } from '@nx/js';
import { isUsingTsSolutionSetup, maybeAddTsConfigPath } from '@nxext/common';
// Not re-exported by @nxext/common's ts-solution module (which only wraps
// the full wireTsSolutionProject combo) - imported directly. @nx/js is
// already a runtime dependency of this package.
import { addProjectToTsSolutionWorkspace } from '@nx/js/internal';

async function normalizeOptions(
  host: Tree,
  options: RawLibrarySchema
): Promise<LibrarySchema> {
  await ensureRootProjectName(options, 'library');
  const {
    projectName: resolvedProjectName,
    projectRoot,
    importPath,
  } = await determineProjectNameAndRootOptions(host, {
    name: options.name,
    projectType: 'library',
    directory: options.directory,
    importPath: options.importPath,
  });

  const isUsingTsSolutionConfig = isUsingTsSolutionSetup(host);
  // Design 1.5 (mirrors @nxext/common's normalizeViteLibCore/@nx/react):
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

  const style = calculateStyle(options.style);
  const appType = AppType.library;

  return {
    ...options,
    name: projectName,
    projectName,
    projectRoot,
    projectDirectory: projectRoot,
    parsedTags,
    style,
    appType,
    importPath,
    // Always the plain, pre-importPath-substitution name (see schema doc) -
    // used for Stencil's own `namespace` config value, which must never
    // contain the npm scope.
    simpleProjectName: resolvedProjectName,
    isUsingTsSolutionConfig,
    useProjectJson: !isUsingTsSolutionConfig,
  } as LibrarySchema;
}

function createFiles(host: Tree, options: LibrarySchema) {
  const substitutions = {
    ...options,
    ...names(options.name),
    offsetFromRoot: offsetFromRoot(options.projectRoot),
  };

  // Files identical in both modes (Design 3.2): lib source, stencil config,
  // the runtime tsconfigs (tsconfig.lib.json's TS-solution-specific
  // `extends`/compilerOptions divergence is applied programmatically
  // afterwards by `wireTsSolutionProject`, see libraryGenerator below).
  generateFiles(
    host,
    joinPathFragments(__dirname, './files/common'),
    options.projectRoot,
    substitutions
  );

  // The outer `tsconfig.json` is the one file that genuinely differs by
  // mode - see the application generator's identical comment.
  generateFiles(
    host,
    joinPathFragments(
      __dirname,
      options.isUsingTsSolutionConfig
        ? './files/ts-solution'
        : './files/non-ts-solution'
    ),
    options.projectRoot,
    substitutions
  );

  if (options.unitTestRunner === 'none') {
    host.delete(
      `${options.projectRoot}/src/components/my-component/my-component.spec.ts`
    );
  }

  if (options.e2eTestRunner === 'none') {
    host.delete(
      `${options.projectRoot}/src/components/my-component/my-component.e2e.ts`
    );
  }

  if (!options.component) {
    host.delete(`${options.projectRoot}/src/components/my-component`);
  }
}

export async function libraryGenerator(host: Tree, schema: RawLibrarySchema) {
  const options = await normalizeOptions(host, schema);

  if (options.publishable === true && !options.importPath) {
    throw new Error(
      `For publishable libs you have to provide a proper "--importPath" which needs to be a valid npm package name (e.g. my-awesome-lib or @myorg/my-lib)`
    );
  }

  const jsInitTask = await jsInitGenerator(host, {
    ...options,
    tsConfigName: 'tsconfig.base.json',
    skipFormat: true,
  });

  const initTask = await initGenerator(host, options);

  createFiles(host, options);
  addProject(host, options);

  if (options.isUsingTsSolutionConfig) {
    // Register in pnpm-workspace.yaml/package.json.workspaces ONLY (Design
    // 1.2). Must run AFTER `addProject`: this project is package.json-backed
    // (no project.json) in TS-solution mode, and `make-lib-buildable` below
    // (when buildable/publishable) resolves the project via
    // `readProjectConfiguration`, which depends on this registration.
    //
    // Deliberately NOT `wireTsSolutionProject`/`updateTsconfigFiles` and NO
    // root tsconfig.json `references` entry - same rationale as the
    // application generator (see the detailed comment there): Stencil
    // reads the project's own `./tsconfig.json`, force-overrides
    // declaration emit per output target, and only preserves
    // `moduleResolution: bundler`; the workspace TS-solution base
    // (`composite`, `emitDeclarationOnly`, `customConditions`,
    // `module: nodenext`, `strict`) is unbuildable for it. The generated
    // `tsconfig.json` (files/ts-solution) is a standalone, non-composite
    // Stencil config - and non-composite projects must not appear in the
    // root tsconfig.json `references`.
    await addProjectToTsSolutionWorkspace(host, options.projectRoot);
  }

  // TS-solution mode never writes a `paths` entry (Design 1.6): cross-project
  // resolution happens via package-manager workspace symlinks + project
  // references (wireTsSolutionProject above) instead.
  maybeAddTsConfigPath(
    host,
    options.importPath,
    [joinPathFragments(options.projectRoot, 'src/index.ts')],
    options.isUsingTsSolutionConfig
  );

  if (options.buildable || options.publishable) {
    await makeLibBuildableGenerator(host, {
      name: options.projectName,
      importPath: options.importPath,
      style: options.style,
    } as MakeLibBuildableSchema);
  }

  if (!options.skipFormat) {
    await formatFiles(host);
  }

  return runTasksInSerial(jsInitTask, initTask, () =>
    logShowProjectCommand(options.projectName)
  );
}

export default libraryGenerator;
