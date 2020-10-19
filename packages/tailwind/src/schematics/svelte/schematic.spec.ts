import { Tree } from '@angular-devkit/schematics';
import { SchematicTestRunner } from '@angular-devkit/schematics/testing';
import { createEmptyWorkspace } from '@nrwl/workspace/testing';
import { join } from 'path';

import { Schema } from './schema';
import { readJsonInTree } from '@nrwl/workspace';

describe('svelte schematic', () => {
  let appTree: Tree;
  const options: Schema = { project: 'test' };

  const testRunner = new SchematicTestRunner(
    '@nxext/tailwind',
    join(__dirname, '../../../collection.json')
  );

  beforeEach(async () => {
    appTree = await createTestApp('test');
  });

  it('should run successfully', async () => {
    await expect(testRunner.runSchematicAsync(
      'svelte',
      options,
      appTree
      ).toPromise()
    ).resolves.not.toThrowError();
  });

  it('should create files', async () => {
    const result = await testRunner.runSchematicAsync(
      'svelte',
      options,
      appTree
    ).toPromise();

    expect(result.exists(`apps/${options.project}/src/Tailwind.svelte`));
    expect(result.exists(`apps/${options.project}/tailwind.config.js`));
    expect(result.exists(`apps/${options.project}/update-svelte-preprocess.js`));
  });

  it('should add dependencies', async () => {
    const result = await testRunner.runSchematicAsync(
      'svelte',
      options,
      appTree
    ).toPromise();

    const packageJson = readJsonInTree(result, 'package.json');
    expect(packageJson.devDependencies['tailwindcss']).toBeDefined();
  });
});

const svelteTestRunner = new SchematicTestRunner(
  '@nxext/svelte',
  join(__dirname, '../../../../svelte/collection.json')
);

export async function createTestApp(
  name: string
): Promise<Tree> {
  let appTree = createEmptyWorkspace(Tree.empty());
  appTree = await svelteTestRunner
    .runSchematicAsync('application', { name: name }, appTree)
    .toPromise();

  return appTree;
}
