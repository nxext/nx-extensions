import { Tree } from '@angular-devkit/schematics';
import { SchematicTestRunner } from '@angular-devkit/schematics/testing';
import { serializeJson } from '@nx/devkit';
import { readJsonInTree } from '@nx/workspace';
import { createEmptyWorkspace } from '@nx/workspace/testing';
import * as path from 'path';

describe('Update 3.1.0', () => {
  let initialTree: Tree;
  let schematicRunner: SchematicTestRunner;

  beforeEach(async () => {
    initialTree = createEmptyWorkspace(Tree.empty());

    schematicRunner = new SchematicTestRunner(
      '@nxext/ionic-react',
      path.join(__dirname, '../../../migrations.json')
    );

    initialTree.overwrite(
      'package.json',
      serializeJson({
        devDependencies: {
          '@nxext/ionic-react': '0.0.0',
        },
      })
    );

    initialTree.overwrite(
      'workspace.json',
      serializeJson({
        projects: {
          'app-one': {
            root: 'apps/app-one',
            architect: {
              build: {
                options: {
                  webpackConfig: '@nxext/ionic-react/plugins/webpack',
                },
              },
            },
          },
          'app-one-e2e': {
            root: 'apps/app-one-e2e',
            architect: {},
          },
        },
      })
    );

    initialTree.create(
      'apps/app-one-e2e/tsconfig.json',
      serializeJson({
        extends: '../../tsconfig.base.json',
        files: [],
        include: [],
        references: [
          {
            path: './tsconfig.e2e.json',
          },
        ],
        compilerOptions: {
          types: ['@types/testing-library__cypress'],
        },
      })
    );

    initialTree.create(
      'apps/app-one-e2e/tsconfig.e2e.json',
      serializeJson({
        extends: './tsconfig.json',
        compilerOptions: {
          sourceMap: false,
          outDir: '../../dist/out-tsc',
          allowJs: true,
          types: ['cypress', 'node'],
        },
        include: ['src/**/*.ts', 'src/**/*.js'],
      })
    );
  });

  it(`should @testing-library/cypress tsconfig types`, async () => {
    const result = await schematicRunner
      .runSchematicAsync(
        'update-testing-library-cypress-tsconfig-types-3.1.0',
        {},
        initialTree
      )
      .toPromise();

    const appOneTsconfig = readJsonInTree(
      result,
      'apps/app-one-e2e/tsconfig.json'
    );
    const appOneTsconfigE2e = readJsonInTree(
      result,
      'apps/app-one-e2e/tsconfig.e2e.json'
    );

    expect(appOneTsconfig.compilerOptions.types).toEqual([]);
    expect(appOneTsconfigE2e.compilerOptions.types).toContain(
      '@testing-library/cypress'
    );
  });
});
