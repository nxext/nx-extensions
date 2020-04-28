import { Tree } from '@angular-devkit/schematics';
import { SchematicTestRunner } from '@angular-devkit/schematics/testing';
import { createEmptyWorkspace } from '@nrwl/workspace/testing';
import { join } from 'path';

import { readJsonInTree } from '@nrwl/workspace';
import { AppType, STYLE_PLUGIN_DEPENDENCIES } from '../../utils/typings';
import { SUPPORTED_STYLE_LIBRARIES } from '../../utils/testing';
import { CoreSchema } from '../core/schema';

describe('stencil schematic', () => {
  let appTree: Tree;
  const options: CoreSchema = { name: 'test' };

  const testRunner = new SchematicTestRunner(
    '@nxext/stencil',
    join(__dirname, '../../../collection.json')
  );

  beforeEach(() => {
    appTree = createEmptyWorkspace(Tree.empty());
  });

  it('should run successfully', async () => {
    await expect(
      testRunner.runSchematicAsync('application', options, appTree).toPromise()
    ).resolves.not.toThrowError();
  });

  it('should add Stencil dependencies', async () => {
    const result = await testRunner
      .runSchematicAsync('app', { name: 'test', appType: AppType.Application }, appTree)
      .toPromise();
    const packageJson = readJsonInTree(result, 'package.json');
    expect(packageJson.devDependencies['@stencil/core']).toBeDefined();
    expect(packageJson.devDependencies['@ionic/core']).toBeUndefined();
  });

  SUPPORTED_STYLE_LIBRARIES.forEach(style => {
    it(`should add Stencil ${style} dependencies to application`, async () => {
      const result = await testRunner
        .runSchematicAsync('app', { name: 'test', style: style, appType: AppType.Application }, appTree)
        .toPromise();
      const packageJson = readJsonInTree(result, 'package.json');
      expect(packageJson.devDependencies['@stencil/core']).toBeDefined();

      const styleDependencies = STYLE_PLUGIN_DEPENDENCIES[style];
      for (const devDependenciesKey in styleDependencies.devDependencies) {
        expect(packageJson.devDependencies[devDependenciesKey]).toBeDefined();
      }
    });
  });
});
