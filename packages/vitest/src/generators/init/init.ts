import {
  addDependenciesToPackageJson,
  convertNxGenerator,
  stripIndents,
  Tree,
  updateJson,
} from '@nrwl/devkit';
import { InitGeneratorSchema } from './schema';
import { c8Version, vitestVersion } from '../../utils/versions';

function removeNxextVitestFromDeps(host: Tree) {
  updateJson(host, 'package.json', (json) => {
    // check whether updating the package.json is necessary
    if (json.dependencies && json.dependencies['@nxext/vitest']) {
      delete json.dependencies['@nxext/vitest'];
    }
    return json;
  });
}

function updateDependencies(host: Tree) {
  updateJson(host, 'package.json', (json) => {
    if (json.dependencies && json.dependencies['@nxext/vitest']) {
      if (json.dependencies['@nxext/vitest']) {
        json.devDependencies['@nxext/vitest'] =
          json.dependencies['@nxext/vitest'];
      }
      delete json.dependencies['@nxext/vitest'];
    }
    return json;
  });

  const devDeps = {
    vitest: vitestVersion,
    c8: c8Version,
  };

  return addDependenciesToPackageJson(host, {}, devDeps);
}

function createVitestConfig(host: Tree) {
  if (!host.exists('vitest.config.ts')) {
    host.write(
      'vitest.config.ts',
      stripIndents`
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true
  },
})
`
    );
  }
}

export function vitestInitGenerator(host: Tree, options: InitGeneratorSchema) {
  createVitestConfig(host);
  const installTask = updateDependencies(host);
  removeNxextVitestFromDeps(host);

  return installTask;
}

export default vitestInitGenerator;
export const vitestInitSchematic = convertNxGenerator(vitestInitGenerator);
