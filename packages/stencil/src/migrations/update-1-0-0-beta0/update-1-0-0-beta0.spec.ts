import { Tree } from '@angular-devkit/schematics';
import { SchematicTestRunner } from '@angular-devkit/schematics/testing';
import { readJsonInTree } from '@nrwl/workspace';
import * as path from 'path';
import { createTestUILib } from '../../utils/testing';

describe('update-1-0-0-beta0', () => {
  let tree: Tree;
  let schematicRunner: SchematicTestRunner;

  beforeEach(async () => {
    tree = await createTestUILib('testlib', 'css');

    schematicRunner = new SchematicTestRunner(
      '@nrwl/nx-plugin',
      path.join(__dirname, '../../../migrations.json')
    );

    tree.overwrite('workspace.json', JSON.stringify(oldWorkspaceJson));
  });

  it(`should update serve builder`, async () => {
    const result = await schematicRunner
      .runSchematicAsync('update-1-0-0-beta0', {}, tree)
      .toPromise();

    const workspaceJson = readJsonInTree(result, '/workspace.json');
    expect(workspaceJson).toEqual(newWorkspaceJson);
  });
});

const oldWorkspaceJson = {
  version: 1,
  projects: {
    testlib: {
      projectType: 'library',
      schematics: {
        '@nxext/stencil:component': {
          style: 'css',
          storybook: false,
        },
      },
      root: 'libs/testlib',
      sourceRoot: 'libs/testlib/src',
      architect: {
        build: {
          builder: '@nxext/stencil:build',
          options: {
            projectType: 'library',
            configPath: 'libs/testlib/stencil.config.ts',
          },
        },
        test: {
          builder: '@nxext/stencil:test',
          options: {
            projectType: 'library',
            configPath: 'libs/testlib/stencil.config.ts',
          },
        },
        e2e: {
          builder: '@nxext/stencil:e2e',
          options: {
            projectType: 'library',
            configPath: 'libs/testlib/stencil.config.ts',
          },
        },
        serve: {
          builder: '@nxext/stencil:serve',
          options: {
            projectType: 'library',
            configPath: 'libs/testlib/stencil.config.ts',
          },
        },
      },
    },
  },
  cli: {
    defaultCollection: '@nxext/stencil',
  },
  schematics: {
    '@nrwl/workspace': {
      library: {
        linter: 'eslint',
      },
    },
    '@nrwl/cypress': {
      'cypress-project': {
        linter: 'eslint',
      },
    },
    '@nrwl/react': {
      application: {
        linter: 'eslint',
      },
      library: {
        linter: 'eslint',
      },
      'storybook-configuration': {
        linter: 'eslint',
      },
    },
    '@nrwl/next': {
      application: {
        linter: 'eslint',
      },
    },
    '@nrwl/web': {
      application: {
        linter: 'eslint',
      },
    },
    '@nrwl/node': {
      application: {
        linter: 'eslint',
      },
      library: {
        linter: 'eslint',
      },
    },
    '@nrwl/nx-plugin': {
      plugin: {
        linter: 'eslint',
      },
    },
    '@nrwl/nest': {
      application: {
        linter: 'eslint',
      },
    },
    '@nrwl/express': {
      application: {
        linter: 'eslint',
      },
      library: {
        linter: 'eslint',
      },
    },
  },
};

const newWorkspaceJson = {
  version: 1,
  projects: {
    testlib: {
      projectType: 'library',
      schematics: {
        '@nxext/stencil:component': {
          style: 'css',
          storybook: false,
        },
      },
      root: 'libs/testlib',
      sourceRoot: 'libs/testlib/src',
      architect: {
        build: {
          builder: '@nxext/stencil:build',
          options: {
            projectType: 'library',
            configPath: 'libs/testlib/stencil.config.ts',
          },
        },
        test: {
          builder: '@nxext/stencil:test',
          options: {
            projectType: 'library',
            configPath: 'libs/testlib/stencil.config.ts',
          },
        },
        e2e: {
          builder: '@nxext/stencil:e2e',
          options: {
            projectType: 'library',
            configPath: 'libs/testlib/stencil.config.ts',
          },
        },
        serve: {
          builder: '@nxext/stencil:build',
          options: {
            projectType: 'library',
            configPath: 'libs/testlib/stencil.config.ts',
            watch: true,
            serve: true,
          },
        },
      },
    },
  },
  cli: {
    defaultCollection: '@nxext/stencil',
  },
  schematics: {
    '@nrwl/workspace': {
      library: {
        linter: 'eslint',
      },
    },
    '@nrwl/cypress': {
      'cypress-project': {
        linter: 'eslint',
      },
    },
    '@nrwl/react': {
      application: {
        linter: 'eslint',
      },
      library: {
        linter: 'eslint',
      },
      'storybook-configuration': {
        linter: 'eslint',
      },
    },
    '@nrwl/next': {
      application: {
        linter: 'eslint',
      },
    },
    '@nrwl/web': {
      application: {
        linter: 'eslint',
      },
    },
    '@nrwl/node': {
      application: {
        linter: 'eslint',
      },
      library: {
        linter: 'eslint',
      },
    },
    '@nrwl/nx-plugin': {
      plugin: {
        linter: 'eslint',
      },
    },
    '@nrwl/nest': {
      application: {
        linter: 'eslint',
      },
    },
    '@nrwl/express': {
      application: {
        linter: 'eslint',
      },
      library: {
        linter: 'eslint',
      },
    },
  },
};
