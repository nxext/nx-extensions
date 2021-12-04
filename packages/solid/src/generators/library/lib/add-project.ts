import { NormalizedSchema } from '../schema';
import { ProjectType } from '@nrwl/workspace';
import {
  addProjectConfiguration,
  getWorkspaceLayout,
  TargetConfiguration,
  Tree,
} from '@nrwl/devkit';

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
    projectType: ProjectType.Library,
    tags: options.parsedTags,
    targets,
  });
}

function createBuildTarget(
  tree: Tree,
  options: NormalizedSchema
): TargetConfiguration {
  if (options.buildable || options.publishable) {
    return buildable(tree, options);
  }
  return noneBuildable(tree, options);
}

const noneBuildable = (tree: Tree, options: NormalizedSchema) => {
  const { libsDir } = getWorkspaceLayout(tree);

  return {
    executor: '@nxext/vite:build',
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
};

const buildable = (tree: Tree, options: NormalizedSchema) => {
  const { libsDir } = getWorkspaceLayout(tree);

  return {
    executor: '@nxext/vite:package',
    outputs: ['{options.outputPath}'],
    options: {
      outputPath: `dist/${libsDir}/${options.projectDirectory}`,
      entryFile: `${options.projectRoot}/src/index.ts`,
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
};

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
