import {
  ensurePackage,
  formatFiles,
  GeneratorCallback,
  joinPathFragments,
  logger,
  NX_VERSION,
  readJson,
  readProjectConfiguration,
  runTasksInSerial,
  stripIndents,
  Tree,
} from '@nx/devkit';
import { isBuildableStencilProject } from '../../utils/utillities';
import { updatePreview } from './lib/update-preview';
import { updateMain } from './lib/update-main';
import { updateLintConfig } from './lib/update-lint-config';
import { StorybookConfigureSchema } from './schema';
import { getNpmScope } from '@nx/js/internal';

/**
 * Returns the path portion to be used for import statements or a
 * tsconfig.json `paths` entry for `projectName`.
 *
 * TS-solution (package.json-backed) projects already carry their real
 * import path as `package.json.name` (Design 1.4/2.5) - which may differ
 * from the `@<npmScope>/<projectName>` guess below (e.g. an explicit
 * `--importPath` given at generation time). Prefer reading it directly;
 * fall back to the historical npmScope-based guess only when no
 * project-level package.json exists yet (legacy, non-buildable projects
 * never get one).
 *
 * @example `@nx-workspace/nx-project`
 * @returns path portion of an import statement
 */
export function getProjectTsImportPath(tree: Tree, projectName: string) {
  const { root } = readProjectConfiguration(tree, projectName);
  const packageJsonPath = joinPathFragments(root, 'package.json');
  if (tree.exists(packageJsonPath)) {
    const { name } = readJson(tree, packageJsonPath);
    if (name) {
      return name;
    }
  }

  const npmScope = getNpmScope(tree);
  return `@${npmScope}/${projectName}`;
}

export async function storybookConfigurationGenerator(
  host: Tree,
  rawSchema: StorybookConfigureSchema,
) {
  const tasks: GeneratorCallback[] = [];
  const uiFramework = '@storybook/web-components-vite';
  const options = normalizeSchema(rawSchema);

  const projectConfig = readProjectConfiguration(host, options.name);

  if (!isBuildableStencilProject(projectConfig, host)) {
    logger.info(stripIndents`
      Please use a buildable library for storybook. Storybook needs a generated
      Stencil loader to work (yet). They're working on native Stencil support, but
      it's not ready yet.

      You could make this library buildable with:

      nx generate @nxext/stencil:make-lib-buildable ${options.name}
      or
      ng generate @nxext/stencil:make-lib-buildable ${options.name}
    `);

    return;
  }

  await ensurePackage('@nx/storybook', NX_VERSION);
  const { configurationGenerator } = await import('@nx/storybook');

  const storybookTask = await configurationGenerator(host, {
    project: options.name,
    uiFramework,
    linter: options.linter,
    tsConfiguration: true,
    interactionTests: options.interactionTests,
  });
  tasks.push(storybookTask);

  updatePreview(host, options.name);
  updateMain(host, options.name);
  updateLintConfig(host, options);

  if (options.configureCypress) {
    logger.warn(
      '`configureCypress` was removed from @nx/storybook in v22. Storybook now ships `interactionTests` (Play functions) for UI testing; the option is ignored.',
    );
  }

  await formatFiles(host);

  return runTasksInSerial(...tasks);
}

function normalizeSchema(schema: StorybookConfigureSchema) {
  const defaults = {
    configureCypress: true,
    linter: 'eslint' as const,
  };
  return {
    ...defaults,
    ...schema,
  };
}

export default storybookConfigurationGenerator;
