import { TargetConfiguration } from '@nx/devkit';
import { ProjectType } from '../utils/typings';

/**
 * The only target the generator writes explicitly is `lint`. `build`, `serve`,
 * `test`, and `e2e` are inferred by `@nxext/stencil/plugin` (Project Crystal)
 * from the presence of `stencil.config.ts`. See `packages/stencil/src/plugins/plugin.ts`.
 *
 * The legacy `@nxext/stencil:build|serve|test|e2e` executors remain in
 * `src/executors/` as a backward-compatibility fallback for workspaces that
 * still reference them explicitly in their project.json.
 */
export function getDefaultTargets(
  _projectType: ProjectType,
  options: { projectRoot: string }
): { [key: string]: TargetConfiguration } {
  return {
    lint: getLintTarget(options.projectRoot),
  };
}

export function getLintTarget(projectRoot: string): TargetConfiguration {
  return {
    executor: '@nx/eslint:eslint',
    outputs: ['{options.outputFile}'],
    options: {
      lintFilePatterns: `${projectRoot}/**/*.{ts,tsx}`,
    },
  };
}
