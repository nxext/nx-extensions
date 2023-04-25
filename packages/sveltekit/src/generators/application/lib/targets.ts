import { joinPathFragments, TargetConfiguration } from '@nx/devkit';
import { NormalizedSchema } from '../schema';

export function createViteTargets(options: NormalizedSchema): {
  [key: string]: TargetConfiguration;
} {
  return {
    build: createBuildTarget(options),
    serve: createServeTarget(options),
    check: createSvelteCheckTarget(options),
  };
}

export type ProjectType = 'application' | 'library';

export function createBuildTarget(
  options: NormalizedSchema
): TargetConfiguration {
  return {
    executor: '@nxext/vite:build',
    outputs: ['{options.outputPath}'],
    options: {
      configFile: joinPathFragments(options.projectRoot, 'vite.config.ts'),
      outputPath: joinPathFragments('dist', options.projectRoot),
      assets: [{ glob: '/*', input: './public/**', output: './' }],
      tsConfig: `${options.projectRoot}/tsconfig.app.json`,
    },
    configurations: {
      production: {},
    },
  };
}

export function createServeTarget(
  options: NormalizedSchema
): TargetConfiguration {
  return {
    executor: '@nxext/vite:dev',
    options: {
      configFile: joinPathFragments(options.projectRoot, 'vite.config.ts'),
      outputPath: joinPathFragments('dist', options.projectRoot),
      assets: [{ glob: '/*', input: './public/**', output: './' }],
      tsConfig: `${options.projectRoot}/tsconfig.app.json`,
    },
  };
}

export function createSvelteCheckTarget(
  options: NormalizedSchema
): TargetConfiguration {
  return {
    executor: 'nx:run-commands',
    options: {
      command: 'svelte-check',
      cwd: options.projectRoot,
    },
  };
}
