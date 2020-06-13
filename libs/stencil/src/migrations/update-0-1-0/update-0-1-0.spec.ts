import { Tree } from '@angular-devkit/schematics';
import { SchematicTestRunner } from '@angular-devkit/schematics/testing';
import { readJsonInTree } from '@nrwl/workspace';
import * as path from 'path';
import {
  createTestUILib,
  SUPPORTED_STYLE_LIBRARIES,
} from '../../utils/testing';
import { SupportedStyles } from '../../utils/typings';

describe('update-0-1-0', () => {
  let initialTree: Tree;
  let schematicRunner: SchematicTestRunner;

  beforeEach(async () => {
    schematicRunner = new SchematicTestRunner(
      '@nrwl/nx-plugin',
      path.join(__dirname, '../../../migrations.json')
    );
  });

  (SUPPORTED_STYLE_LIBRARIES as SupportedStyles[]).forEach((style) => {
    it(`should update component schematics config with ${style}`, async () => {
      initialTree = await createTestUILib('library', style);
      const workspaceJson = readJsonInTree(initialTree, '/workspace.json');
      delete workspaceJson.projects.library.schematics;

      initialTree.overwrite('/workspace.json', JSON.stringify(workspaceJson));

      initialTree = await schematicRunner
        .runSchematicAsync('update-0-1-0', {}, initialTree)
        .toPromise();

      const workspaceJsonResult = readJsonInTree(
        initialTree,
        '/workspace.json'
      );

      expect(workspaceJsonResult.projects.library.schematics).toEqual({
        '@nxext/stencil:component': {
          style: style,
          storybook: false,
        },
      });
    });
  });
});
