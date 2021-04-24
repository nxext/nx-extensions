import { Tree, updateJson, readJson } from '@nrwl/devkit';
import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import { default as update } from './update-11-3-1';

describe('update-11-3-1', () => {
  let tree: Tree;

  beforeEach(async () => {
    tree = createTreeWithEmptyWorkspace();
    updateJson(tree, 'workspace.json', workspaceJson => {
      workspaceJson.projects.app = {
        "targets": {
          "build": {
            "executor": "@nxext/stencil:build"
          },
          "serve": {
            "executor": "@nxext/stencil:build"
          },
          "test": {
            "executor": "@nxext/stencil:test"
          },
          "e2e": {
            "executor": "@nxext/stencil:e2e"
          }
        }
      }

      return workspaceJson;
    });
  });

  it(`should update outputs definition`, async () => {
    await update(tree);
    const workspaceJson = readJson(tree, 'workspace.json');

    expect(workspaceJson.projects.app.targets.build.outputs)
      .toEqual(['{options.outputPath}']);
    expect(workspaceJson.projects.app.targets.test.outputs)
      .toEqual(['{options.outputPath}']);
    expect(workspaceJson.projects.app.targets.serve.outputs)
      .toEqual(['{options.outputPath}']);
    expect(workspaceJson.projects.app.targets.e2e.outputs)
      .toEqual(['{options.outputPath}']);
  });

  it(`should ignore already set outputs definition`, async () => {
    updateJson(tree, 'workspace.json', workspaceJson => {
      workspaceJson.projects.app = {
        "targets": {
          "build": {
            "executor": "@nxext/stencil:build",
            "outputs": ["{options.otherOption}"]
          }
        }
      }

      return workspaceJson;
    });
    await update(tree);
    const workspaceJson = readJson(tree, 'workspace.json');

    expect(workspaceJson.projects.app.targets.build.outputs)
      .toEqual(['{options.otherOption}']);
  });
});
