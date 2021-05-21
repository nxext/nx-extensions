import { Tree, updateJson, readJson } from '@nrwl/devkit';
import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import { default as update } from './update-12-0-0';

describe('update-12-0-0', () => {
  let tree: Tree;

  beforeEach(async () => {
    tree = createTreeWithEmptyWorkspace();
  });

  it(`should update generator definition`, async () => {
    updateJson(tree, 'workspace.json', workspaceJson => {
      workspaceJson.projects.app = {
        "targets": {
          "build": {
            "executor": "@nxext/stencil:build"
          }
        },
        "generators": {
          "@nxext/stencil:component": {
            "style": "css",
            "storybook": "false",
          },
        }
      }

      return workspaceJson;
    });

    await update(tree);
    const workspaceJson = readJson(tree, 'workspace.json');

    expect(workspaceJson.projects.app.generators['@nxext/stencil:component'])
      .toEqual({
        style: 'css'
      });
  });

  it(`should ignore generator definitionwithout storybook set`, async () => {
    updateJson(tree, 'workspace.json', workspaceJson => {
      workspaceJson.projects.app = {
        "generators": {
          "@nxext/stencil:component": {
            "style": "css"
          },
        }
      }

      return workspaceJson;
    });

    await update(tree);
    const workspaceJson = readJson(tree, 'workspace.json');

    expect(workspaceJson.projects.app.generators['@nxext/stencil:component'])
      .toEqual({
        style: 'css'
      });
  });
});
