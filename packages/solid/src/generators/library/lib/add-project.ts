import { NormalizedSchema } from '../schema';
import {
  addProjectConfiguration,
  getWorkspaceLayout,
  TargetConfiguration,
  Tree,
} from '@nxext/devkit';

export function addProject(tree: Tree, options: NormalizedSchema) {
  const targets: { [key: string]: TargetConfiguration } = {
    lint: createLintTarget(options),
  };

  if (options.buildable || options.publishable) {
    targets.build = createBuildTarget(tree, options);
  }

  addProjectConfiguration(tree, options.name, {
    root: options.projectRoot,
    sourceRoot: `${options.projectRoot}/src`,
    projectType: 'library',
    tags: options.parsedTags,
    targets,
  });
}

function createBuildTarget(
  tree: Tree,
  options: NormalizedSchema
): TargetConfiguration {
  const { libsDir } = getWorkspaceLayout(tree);

  return {
    executor: '@nxext/vite:package',
    outputs: ['{options.outputPath}'],
    options: {
      outputPath: `dist/${libsDir}/${options.projectDirectory}`,
      entryFile: `src/index.ts`,
      tsConfig: `${options.projectRoot}/tsconfig.lib.json`,
      assets: [{ glob: '/*', input: './public/**', output: './' }],
      frameworkConfigFile: '@nxext/solid/plugins/vite',
    },
    configurations: {
      production: {
        dev: false,
      },
    },
  };
}

function createLintTarget(options: NormalizedSchema): TargetConfiguration {
  return {
    executor: '@nrwl/linter:lint',
    options: {
      linter: 'eslint',
      tsConfig: `${options.projectRoot}/tsconfig.lib.json`,
      exclude: ['**/node_modules/**', `!${options.projectRoot}/**/*`],
    },
  };
}
