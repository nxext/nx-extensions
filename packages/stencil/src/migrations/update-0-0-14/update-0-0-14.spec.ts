import { Tree } from '@angular-devkit/schematics';
import { readJsonInTree } from '@nrwl/workspace';
import { createTestUILib, runMigration } from '../../utils/testing';

describe('update-0-0-14', () => {
  let initialTree: Tree;

  beforeEach(async () => {
    initialTree = await createTestUILib('library');

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
    const result = await runMigration('update-0-0-14', {}, initialTree);

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
