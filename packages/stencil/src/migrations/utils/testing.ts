import { join } from 'path';
import { createEmptyWorkspace } from '@nrwl/workspace/testing';
import { externalSchematic, Rule, Tree } from '@angular-devkit/schematics';
import { SchematicTestRunner } from '@angular-devkit/schematics/testing';
import { SupportedStyles } from '../../stencil-core-utils';

const testRunner = new SchematicTestRunner(
  '@nxext/stencil',
  join(__dirname, '../../../generators.json')
);

const migrationRunner = new SchematicTestRunner(
  '@nxext/stencil',
  join(__dirname, '../../../migrations.json')
);

export function callRule(rule: Rule, tree: Tree) {
  return testRunner.callRule(rule, tree).toPromise();
}

export function runMigration(migrationName: string, options: any, tree: Tree) {
  return migrationRunner
    .runSchematicAsync(migrationName, options, tree)
    .toPromise();
}

export async function createTestUILib(
  libName: string,
  style: SupportedStyles = SupportedStyles.css,
  buildable = true
): Promise<Tree> {
  let appTree = createEmptyWorkspace(Tree.empty());
  appTree = await callRule(
    externalSchematic('@nxext/stencil', 'library', {
      name: libName,
      style: style,
      buildable,
    }),
    appTree
  );

  return appTree;
}
