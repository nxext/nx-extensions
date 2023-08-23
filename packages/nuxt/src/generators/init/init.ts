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
import {
  nuxtDevtoolsVersion,
  nuxtKitVersion,
  nuxtVersion,
  nxextVueVersion,
  vueTestUtilsVersion,
  vueTscVersion,
  vueVersion,
} from '../utils/versions';
import { InitSchema } from './schema';
import { initGenerator as jsInitGenerator } from '@nx/js';
import { addPluginToNxJson } from '@nxext/core';

function updateDependencies(host: Tree) {
  const dependencies: Record<string, string> = {
    vue: vueVersion,
  };

  const devDependencies = {
    nuxt: nuxtVersion,
    'vue-tsc': vueTscVersion,
    '@nuxt/kit': nuxtKitVersion,
    '@nuxt/devtools': nuxtDevtoolsVersion,
    '@nx/vite': NX_VERSION,
    '@vue/test-utils': vueTestUtilsVersion,
    '@nxext/vue': nxextVueVersion,
  };

  return addDependenciesToPackageJson(host, dependencies, devDependencies);
}

export async function initGenerator(host: Tree, schema: InitSchema) {
  const tasks: GeneratorCallback[] = [];

  updateDependencies(host);

  if (!schema.e2eTestRunner || schema.e2eTestRunner === 'cypress') {
    await ensurePackage('@nx/cypress', NX_VERSION);
    const { cypressInitGenerator } = await import('@nx/cypress');
    const cypressTask = await cypressInitGenerator(host, {});
    tasks.push(cypressTask);
  }

  await jsInitGenerator(host, {
    skipFormat: true,
  });

  await ensurePackage('@nxext/vue', nxextVueVersion);
  await ensurePackage('@nx/vite', NX_VERSION);

  // Add plugin for dep graph support of Vue SFCs
  addPluginToNxJson('@nxext/vue', host);

  if (!schema.skipFormat) {
    await formatFiles(host);
  }

  return runTasksInSerial(...tasks);
}

export default initGenerator;
export const initSchematic = convertNxGenerator(initGenerator);
