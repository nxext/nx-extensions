import { AppType } from '../../utils/typings';
import {
  readJson,
  readWorkspaceConfiguration,
  Tree,
  updateJson,
} from '@nrwl/devkit';
import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import { initGenerator } from './init';

describe('init', () => {
  let host: Tree;

  beforeEach(() => {
    host = createTreeWithEmptyWorkspace({ layout: 'apps-libs' });
    updateJson(host, '/package.json', (json) => {
      json.devDependencies = {
        '@nrwl/workspace': '15.7.0',
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

  it('should add stencil pwa dependencies', async () => {
    await initGenerator(host, { name: 'test', appType: AppType.pwa });
    const packageJson = readJson(host, 'package.json');
    expect(packageJson.devDependencies['@stencil/core']).toBeDefined();
    expect(packageJson.devDependencies['@ionic/core']).toBeDefined();
  });

  describe('defaultCollection', () => {
    it('should be set if none was set before', async () => {
      await initGenerator(host, { name: 'test', appType: AppType.application });
      const workspaceJson = readWorkspaceConfiguration(host);
      expect(workspaceJson.cli.defaultCollection).toEqual('@nxext/stencil');
    });
  });
});
