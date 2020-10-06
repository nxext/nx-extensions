import { Architect } from '@angular-devkit/architect';
import { schema } from '@angular-devkit/core';
import { TestingArchitectHost } from '@angular-devkit/architect/testing';
import { join } from 'path';
import {
  createEmptyWorkspace,
  MockBuilderContext,
} from '@nrwl/workspace/testing';
import { externalSchematic, Rule, Tree } from '@angular-devkit/schematics';
import { SchematicTestRunner } from '@angular-devkit/schematics/testing';

const testRunner = new SchematicTestRunner(
  '@nxext/svelte',
  join(__dirname, '../../../collection.json')
);

/*
const migrationRunner = new SchematicTestRunner(
  '@nxext/svelte',
  join(__dirname, '../../../migrations.json')
);
*/

export async function createTestProject(name: string): Promise<Tree> {
  let appTree = createEmptyWorkspace(Tree.empty());
  appTree = await callRule(
    externalSchematic('@nxext/svelte', 'app', {
      name: name,
    }),
    appTree
  );

  return appTree;
}

export async function mockContext() {
  const registry = new schema.CoreSchemaRegistry();
  registry.addPostTransform(schema.transforms.addUndefinedDefaults);

  const architectHost = new TestingArchitectHost('/root', '/root');
  const architect = new Architect(architectHost, registry);

  await architectHost.addBuilderFromPackage(join(__dirname, '../..'));

  const context = new MockBuilderContext(architect, architectHost);
  await context.addBuilderFromPackage(join(__dirname, '../..'));
  await context.addTarget({ project: 'test', target: 'test' }, 'build');

  return [architect, context] as [Architect, MockBuilderContext];
}

export function runSchematic<SchemaOptions = any>(
  schematicName: string,
  options: SchemaOptions,
  tree: Tree
) {
  return testRunner.runSchematicAsync(schematicName, options, tree).toPromise();
}

export function callRule(rule: Rule, tree: Tree) {
  return testRunner.callRule(rule, tree).toPromise();
}

/*
export function runMigration(migrationName: string, options: any, tree: Tree) {
  return migrationRunner
    .runSchematicAsync(migrationName, options, tree)
    .toPromise();
}
*/
