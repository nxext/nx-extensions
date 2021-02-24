import { Tree } from '@angular-devkit/schematics';
import { SchematicTestRunner } from '@angular-devkit/schematics/testing';
import { createEmptyWorkspace } from '@nrwl/workspace/testing';
import { join } from 'path';

import { Schema } from './schematic';
import { readJsonInTree } from '@nrwl/workspace';

describe('stencil tailwindcss schematic', () => {
  let appTree: Tree;
  const options: Schema = { project: 'test', skipFormat: false };

  const testRunner = new SchematicTestRunner(
    '@nxext/tailwind',
    join(__dirname, '../../../collection.json')
  );

  beforeEach(async () => {
    appTree = await createTestApp('test');
  });

  it('should run successfully', async () => {
    await expect(testRunner.runSchematicAsync(
      'stencil',
      options,
      appTree
      ).toPromise()
    ).resolves.not.toThrowError();
  });

  it('should create files', async () => {
    const result = await testRunner.runSchematicAsync(
      'stencil',
      options,
      appTree
    ).toPromise();

    expect(result.exists(`apps/${options.project}/tailwind.config.js`)).toBe(true);
  });

  it('should add dependencies', async () => {
    const result = await testRunner.runSchematicAsync(
      'stencil',
      options,
      appTree
    ).toPromise();

    const packageJson = readJsonInTree(result, 'package.json');
    expect(packageJson.devDependencies['tailwindcss']).toBeDefined();
    expect(packageJson.devDependencies['cssnano']).toBeDefined();
    expect(packageJson.devDependencies['autoprefixer']).toBeDefined();
    expect(packageJson.devDependencies['@stencil/postcss']).toBeDefined();
  });
});

const stencilTestRunner = new SchematicTestRunner(
  '@nxext/stencil',
  join(__dirname, '../../../../stencil/collection.json')
);

export async function createTestApp(
  name: string
): Promise<Tree> {
  let appTree = createEmptyWorkspace(Tree.empty());
  appTree = await stencilTestRunner
    .runSchematicAsync('application', { name: name, style: 'css' }, appTree)
    .toPromise();

  return appTree;
}
