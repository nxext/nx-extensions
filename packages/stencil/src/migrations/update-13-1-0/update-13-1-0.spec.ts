import { Tree, updateJson, readProjectConfiguration } from '@nrwl/devkit';
import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import { default as update } from './update-13-1-0';

describe('update-13-1-0', () => {
  let tree: Tree;

  beforeEach(async () => {
    tree = createTreeWithEmptyWorkspace();
  });

  it(`should add the lint target`, async () => {
    updateJson(tree, 'workspace.json', (workspaceJson) => {
      workspaceJson.projects.app = {
        root: 'apps/app',
        targets: {
          build: {
            builder: '@nxext/stencil:build',
            outputs: ['{options.outputPath}'],
            options: {
              projectType: 'application',
              tsConfig: 'apps/app/tsconfig.app.json',
              configPath: 'apps/app/stencil.config.ts',
            },
            configurations: {
              production: {
                dev: false,
              },
            },
          },
          serve: {
            builder: '@nxext/stencil:build',
            outputs: ['{options.outputPath}'],
            options: {
              projectType: 'application',
              tsConfig: 'apps/app/tsconfig.app.json',
              configPath: 'apps/app/stencil.config.ts',
              serve: true,
              watch: true,
            },
          },
          test: {
            builder: '@nxext/stencil:test',
            outputs: ['{options.outputPath}'],
            options: {
              projectType: 'application',
              tsConfig: 'apps/app/tsconfig.app.json',
              configPath: 'apps/app/stencil.config.ts',
            },
          },
          e2e: {
            builder: '@nxext/stencil:e2e',
            outputs: ['{options.outputPath}'],
            options: {
              projectType: 'application',
              tsConfig: 'apps/app/tsconfig.app.json',
              configPath: 'apps/app/stencil.config.ts',
            },
          },
        },
      };

      return workspaceJson;
    });

    await update(tree);
    const projectConfig = readProjectConfiguration(tree, 'app');

    expect(projectConfig.targets.lint).toBeDefined();
  });
});
