import { AppType } from '../../utils/typings';
import { readJson, Tree, updateJson } from '@nx/devkit';
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { initGenerator } from './init';

describe('init', () => {
  let host: Tree;

  beforeEach(() => {
    host = createTreeWithEmptyWorkspace({ layout: 'apps-libs' });
    updateJson(host, '/package.json', (json) => {
      json.devDependencies = {
        '@nx/workspace': '15.7.0',
      };
      return json;
    });
  });

  it('should add stencil dependencies', async () => {
    await initGenerator(host, { name: 'test', appType: AppType.library });
    const packageJson = readJson(host, 'package.json');
    expect(packageJson.devDependencies['@stencil/core']).toBeDefined();
  });

  it('should add stencil app dependencies', async () => {
    await initGenerator(host, { name: 'test', appType: AppType.application });
    const packageJson = readJson(host, 'package.json');
    expect(packageJson.devDependencies['@stencil/core']).toBeDefined();
    expect(packageJson.devDependencies['@stencil/router']).toBeDefined();
    expect(packageJson.devDependencies['@ionic/core']).toBeUndefined();
  });

  it('registers @nxext/stencil/plugin in nx.json so Crystal can infer tasks', async () => {
    await initGenerator(host, { name: 'test', appType: AppType.library });

    const nxJson = readJson(host, 'nx.json');
    const pluginNames = (nxJson.plugins ?? []).map(
      (p: string | { plugin: string }) => (typeof p === 'string' ? p : p.plugin)
    );
    expect(pluginNames).toContain('@nxext/stencil/plugin');
  });
});
