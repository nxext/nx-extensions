import {
  addProjectConfiguration,
  readProjectConfiguration,
  Tree,
} from '@nx/devkit';
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import capacitorMigartion from './capacitor-3-migration-12-0-0';

describe('Add Capacitor 3 run target', () => {
  let tree: Tree;

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace({ layout: 'apps-libs' });

    addProjectConfiguration(tree, 'cap-app-1', {
      root: 'apps/cap-app-1',
      targets: {
        cap: {
          executor: '@nxtend/capacitor:cap',
          options: {
            cmd: '--help',
          },
        },
      },
    });

    addProjectConfiguration(tree, 'non-cap-app-1', {
      root: 'apps/non-cap-app-1',
      targets: {
        cap: {
          executor: '@nrwl/web:serve',
        },
      },
    });
  });

  it('should add run target', async () => {
    await capacitorMigartion(tree);
    const capAppProjectConfiguration = readProjectConfiguration(
      tree,
      'cap-app-1'
    );
    const nonCapAppProjectConfiguration = readProjectConfiguration(
      tree,
      'non-cap-app-1'
    );
    expect(capAppProjectConfiguration.targets['run']).toBeTruthy();
    expect(nonCapAppProjectConfiguration.targets['run']).toBeFalsy();
  });
});
