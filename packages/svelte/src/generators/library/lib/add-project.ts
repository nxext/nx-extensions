import { NormalizedSchema } from '../schema';
import { ProjectType } from '@nrwl/workspace';
import {
  addProjectConfiguration,
  getWorkspaceLayout,
  joinPathFragments,
  NxJsonProjectConfiguration,
  TargetConfiguration,
  Tree,
} from '@nrwl/devkit';

export function addProject(tree: Tree, options: NormalizedSchema) {
  const targets: { [key: string]: TargetConfiguration } = {
    lint: createLintTarget(options),
  };

  if (options.unitTestRunner === 'jest') {
    targets.test = createTestTarget(options);
  } else {
    tree.delete(joinPathFragments(options.projectRoot, 'jest.config.js'));
    tree.delete(joinPathFragments(options.projectRoot, 'tsconfig.spec.json'));
  }

  if (options.buildable) {
    targets.build = createBuildTarget(tree, options);
  }

  const nxConfig: NxJsonProjectConfiguration = {
    tags: options.parsedTags,
  };

  addProjectConfiguration(tree, options.name, {
    root: options.projectRoot,
    sourceRoot: `${options.projectRoot}/src`,
    projectType: ProjectType.Library,
    ...nxConfig,
    targets,
  });
}

function createBuildTarget(
  tree: Tree,
  options: NormalizedSchema
): TargetConfiguration {
  const { libsDir } = getWorkspaceLayout(tree);
  return {
    executor: '@nxext/svelte:build',
    outputs: ['{options.outputPath}'],
    options: {
      outputPath: `dist/${libsDir}/${options.projectDirectory}`,
      entryFile: `${options.projectRoot}/src/index.ts`,
      tsConfig: `${options.projectRoot}/tsconfig.lib.json`,
      assets: [{ glob: '/*', input: './public/**', output: './' }],
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

function createTestTarget(options: NormalizedSchema): TargetConfiguration {
  return {
    executor: '@nrwl/jest:jest',
    options: {
      jestConfig: `${options.projectRoot}/jest.config.js`,
      passWithNoTests: true,
    },
  };
}
