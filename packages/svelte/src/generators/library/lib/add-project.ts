import { NormalizedSchema } from '../schema';
import {
  addProjectConfiguration,
  getWorkspaceLayout,
  joinPathFragments,
  TargetConfiguration,
  Tree,
} from '@nrwl/devkit';

export function addProject(tree: Tree, options: NormalizedSchema) {
  const targets: { [key: string]: TargetConfiguration } = {
    lint: createLintTarget(options),
    check: createSvelteCheckTarget(options),
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
    executor: '@nxext/svelte:build',
    outputs: ['{options.outputPath}'],
    options: {
      outputPath: `dist/${libsDir}/${options.projectDirectory}`,
      entryFile: `${options.projectRoot}/src/index.ts`,
      tsConfig: `${options.projectRoot}/tsconfig.lib.json`,
      svelteConfig: joinPathFragments(options.projectRoot, 'svelte.config.cjs'),
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

function createSvelteCheckTarget(
  options: NormalizedSchema
): TargetConfiguration {
  return {
    executor: '@nrwl/workspace:run-commands',
    options: {
      command: 'svelte-check',
      cwd: options.projectRoot,
    },
  };
}
