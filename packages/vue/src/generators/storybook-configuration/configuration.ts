import {
  convertNxGenerator,
  ensurePackage,
  formatFiles,
  NX_VERSION,
  Tree,
} from '@nx/devkit';
import { StorybookConfigurationGeneratorSchema } from './schema';

/*
async function generateStories(host: Tree, schema: StorybookConfigurationGeneratorSchema) {
  ensurePackage('@nx/cypress', NX_VERSION);
  const { getE2eProjectName } = await import(
    '@nx/cypress/src/utils/project-name'
    );
  const projectConfig = readProjectConfiguration(host, schema.name);
  const cypressProject = getE2eProjectName(
    schema.name,
    projectConfig.root,
    schema.cypressDirectory
  );
  await storiesGenerator(host, {
    project: schema.name,
    generateCypressSpecs:
      schema.configureCypress && schema.generateCypressSpecs,
    js: schema.js,
    cypressProject,
    ignorePaths: schema.ignorePaths,
    skipFormat: true,
  });
}
 */

export async function storybookConfigurationGenerator(
  host: Tree,
  schema: StorybookConfigurationGeneratorSchema
) {
  const { configurationGenerator } = ensurePackage<
    typeof import('@nx/storybook')
  >('@nx/storybook', NX_VERSION);

  const installTask = await configurationGenerator(host, {
    name: schema.name,
    configureCypress: schema.configureCypress,
    js: schema.js,
    linter: schema.linter,
    cypressDirectory: schema.cypressDirectory,
    tsConfiguration: schema.tsConfiguration,
    configureTestRunner: schema.configureTestRunner,
    configureStaticServe: schema.configureStaticServe,
    uiFramework: '@storybook/vue3-vite',
    skipFormat: true,
  });

  /*
  if (schema.generateStories) {
    await generateStories(host, schema);
  }*/

  await formatFiles(host);

  return installTask;
}

export default storybookConfigurationGenerator;
export const storybookConfigurationSchematic = convertNxGenerator(
  storybookConfigurationGenerator
);
