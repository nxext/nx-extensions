import { Tree } from '@angular-devkit/schematics';
import { SchematicTestRunner } from '@angular-devkit/schematics/testing';
import { readJsonInTree, serializeJson } from '@nrwl/workspace';
import { createEmptyWorkspace } from '@nrwl/workspace/testing';
import * as path from 'path';
import library from '@nrwl/workspace/src/schematics/library/library';

describe('update-0-0-14', () => {
  let initialTree: Tree;
  let schematicRunner: SchematicTestRunner;

  beforeEach(async () => {
    initialTree = createEmptyWorkspace(Tree.empty());

    schematicRunner = new SchematicTestRunner(
      '@nxext/stencil',
      path.join(__dirname, '../../../migrations.json')
    );

    const stencilRunner = new SchematicTestRunner(
      '@nxext/stencil',
      path.join(__dirname, '../../../collection.json')
    );
    initialTree = await stencilRunner
      .runSchematicAsync('lib', { name: 'library' }, initialTree)
      .toPromise();

    const workspaceJson = readJsonInTree(initialTree, '/workspace.json');
    workspaceJson.projects.library.architect = {
      build: {
        builder: '@nxext/stencil:build',
        options: {
          projectType: 'library',
        },
      },
      test: {
        builder: '@nxext/stencil:test',
        options: {
          projectType: 'library',
        },
      },
      e2e: {
        builder: '@nxext/stencil:e2e',
        options: {
          projectType: 'library',
        },
      },
      serve: {
        builder: '@nxext/stencil:serve',
        options: {
          projectType: 'library',
          configPath: 'my/existing/path/stencil.config.ts',
        },
      },
    };
    initialTree.overwrite('/workspace.json', JSON.stringify(workspaceJson));
  });

  it(`should update builder config path`, async () => {
    const result = await schematicRunner
      .runSchematicAsync('update-0-0-14', {}, initialTree)
      .toPromise();

    const { projects } = readJsonInTree(result, '/workspace.json');
    expect(projects.library.architect).toEqual({
      build: {
        builder: '@nxext/stencil:build',
        options: {
          projectType: 'library',
          configPath: 'libs/library/stencil.config.ts',
        },
      },
      test: {
        builder: '@nxext/stencil:test',
        options: {
          projectType: 'library',
          configPath: 'libs/library/stencil.config.ts',
        },
      },
      e2e: {
        builder: '@nxext/stencil:e2e',
        options: {
          projectType: 'library',
          configPath: 'libs/library/stencil.config.ts',
        },
      },
      serve: {
        builder: '@nxext/stencil:serve',
        options: {
          projectType: 'library',
          configPath: 'my/existing/path/stencil.config.ts',
        },
      },
    });
  });
});
