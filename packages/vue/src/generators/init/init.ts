import {
  addDependenciesToPackageJson,
  convertNxGenerator,
  ensurePackage,
  formatFiles,
  GeneratorCallback,
  Tree,
  runTasksInSerial,
  NX_VERSION,
} from '@nx/devkit';
import { initGenerator as jsInitGenerator } from '@nx/js';
import {
  vitePluginVueVersion,
  vueRouterVersion,
  vueTestUtilsVersion,
  vueTscVersion,
  vueVersion,
} from '../utils/versions';
import { InitSchema } from './schema';
import { addPluginToNxJson } from '../utils/add-plugin-to-nx-json';

function updateDependencies(host: Tree, schema: InitSchema) {
  let dependencies: Record<string, string> = {
    vue: vueVersion,
    'vue-tsc': vueTscVersion,
  };
  if (schema.routing) {
    dependencies = {
      ...dependencies,
      'vue-router': vueRouterVersion,
    };
  }

  const devDependencies = {
    '@vitejs/plugin-vue': vitePluginVueVersion,
    '@vue/test-utils': vueTestUtilsVersion,
  };

  return addDependenciesToPackageJson(host, dependencies, devDependencies);
}

export async function initGenerator(host: Tree, schema: InitSchema) {
  const tasks: GeneratorCallback[] = [];

  updateDependencies(host, schema);

  if (!schema.e2eTestRunner || schema.e2eTestRunner === 'cypress') {
    await ensurePackage('@nx/cypress', NX_VERSION);
    const { cypressInitGenerator } = await import('@nx/cypress');
    const cypressTask = await cypressInitGenerator(host, {});
    tasks.push(cypressTask);
  }

  await jsInitGenerator(host, {
    skipFormat: true,
  });

  addPluginToNxJson('@nxext/vue', host);

  if (!schema.skipFormat) {
    await formatFiles(host);
  }

  return runTasksInSerial(...tasks);
}

export default initGenerator;
export const initSchematic = convertNxGenerator(initGenerator);
