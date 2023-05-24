import {
  convertNxGenerator,
  ensurePackage,
  formatFiles,
  NX_VERSION,
  runTasksInSerial,
  Tree,
} from '@nx/devkit';
import { AppGeneratorSchema } from './schema';
import { capacitorProjectGenerator } from '../capacitor-project/generator';

export async function applicationGenerator(
  tree: Tree,
  options: AppGeneratorSchema
) {
  const viteTask = await createDefaultViteApp(tree, options);

  const capacitorTask = await capacitorProjectGenerator(tree, {
    project: options.name,
    appName: options.name,
    appId: options.appId,
    skipFormat: true,
  });

  await formatFiles(tree);

  return runTasksInSerial(viteTask, capacitorTask);
}

async function createDefaultViteApp(tree: Tree, options: AppGeneratorSchema) {
  const { applicationGenerator } = ensurePackage<typeof import('@nx/web')>(
    '@nx/web',
    NX_VERSION
  );

  return await applicationGenerator(tree, {
    name: options.name,
    bundler: 'vite',
    unitTestRunner: options.unitTestRunner,
    skipFormat: true,
  });
}

export default applicationGenerator;
export const applicationSchematic = convertNxGenerator(applicationGenerator);
