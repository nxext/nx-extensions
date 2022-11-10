import { joinPathFragments, TargetConfiguration } from '@nrwl/devkit';
import { NormalizedSchema as ApplicationSchema } from '../application/schema';
import { NormalizedSchema as LibrarySchema } from '../library/schema';

export function createViteTargets(
  projectType: ProjectType,
  options: LibrarySchema | ApplicationSchema
): {
  [key: string]: TargetConfiguration;
} {
  return {
    build: createBuildTarget(projectType, options),
    serve: createServeTarget(projectType, options),
    lint: createLintTarget(options),
    check: createSvelteCheckTarget(options),
  };
}

export type ProjectType = 'application' | 'library';

export function createPackageTarget(
  projectType: ProjectType,
  options: LibrarySchema | ApplicationSchema
): TargetConfiguration {
  const tsconfigAddition = projectType === 'application' ? 'app' : 'lib';
  return {
    executor: '@nxext/vite:package',
    outputs: ['{options.outputPath}'],
    options: {
      entryFile: `src/index.ts`,
      frameworkConfigFile: '@nxext/svelte/plugins/vite',
      outputPath: joinPathFragments('dist', options.projectRoot),
      assets: [{ glob: '/*', input: './public/**', output: './' }],
      tsConfig: `${options.projectRoot}/tsconfig.${tsconfigAddition}.json`,
    },
    configurations: {
      production: {},
    },
  };
}

export function createBuildTarget(
  projectType: ProjectType,
  options: LibrarySchema | ApplicationSchema
): TargetConfiguration {
  const tsconfigAddition = projectType === 'application' ? 'app' : 'lib';
  return {
    executor: '@nxext/vite:build',
    outputs: ['{options.outputPath}'],
    options: {
      frameworkConfigFile: '@nxext/svelte/plugins/vite',
      outputPath: joinPathFragments('dist', options.projectRoot),
      assets: [{ glob: '/*', input: './public/**', output: './' }],
      tsConfig: `${options.projectRoot}/tsconfig.${tsconfigAddition}.json`,
    },
    configurations: {
      production: {},
    },
  };
}

export function createServeTarget(
  projectType: ProjectType,
  options: LibrarySchema | ApplicationSchema
): TargetConfiguration {
  const tsconfigAddition = projectType === 'application' ? 'app' : 'lib';
  return {
    executor: '@nxext/vite:dev',
    options: {
      frameworkConfigFile: '@nxext/svelte/plugins/vite',
      outputPath: joinPathFragments('dist', options.projectRoot),
      assets: [{ glob: '/*', input: './public/**', output: './' }],
      tsConfig: `${options.projectRoot}/tsconfig.${tsconfigAddition}.json`,
    },
  };
}

export function createSvelteCheckTarget(
  options: LibrarySchema | ApplicationSchema
): TargetConfiguration {
  return {
    executor: '@nrwl/workspace:run-commands',
    options: {
      command: 'svelte-check',
      cwd: options.projectRoot,
    },
  };
}

export function createLintTarget(
  options: LibrarySchema | ApplicationSchema
): TargetConfiguration {
  return {
    executor: '@nrwl/linter:lint',
    options: {
      linter: 'eslint',
      tsConfig: joinPathFragments(options.projectRoot, 'tsconfig.app.json'),
      exclude: [
        '**/node_modules/**',
        `!${joinPathFragments(options.projectRoot, '**/*')}`,
      ],
    },
  };
}
