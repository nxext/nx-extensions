import { Tree } from '@angular-devkit/schematics';
import { ComponentSchema } from './component';
import { createTestUILib, runSchematic } from '../../utils/testing';
import { SupportedStyles } from '../../stencil-core-utils';

describe('component schematic', () => {
  let tree: Tree;
  const projectName = 'test-project';
  const options: ComponentSchema = {
    name: 'test-component',
    project: projectName,
    storybook: false,
  };

  beforeEach(async () => {
    tree = await createTestUILib(projectName, SupportedStyles.scss);
  });

  it('should run successfully', async () => {
    await expect(
      runSchematic('component', options, tree)
    ).resolves.not.toThrowError();
  });

  it('should generate files', async () => {
    tree = await runSchematic('component', options, tree);

    expect(
      tree.exists(
        'libs/test-project/src/components/test-component/test-component.tsx'
      )
    ).toBeTruthy();
    expect(
      tree.exists(
        'libs/test-project/src/components/test-component/test-component.e2e.ts'
      )
    ).toBeTruthy();
    expect(
      tree.exists(
        'libs/test-project/src/components/test-component/test-component.spec.tsx'
      )
    ).toBeTruthy();
    expect(
      tree.exists(
        'libs/test-project/src/components/test-component/test-component.scss'
      )
    ).toBeTruthy();
    expect(
      tree.exists(
        'libs/test-project/src/components/test-component/test-component.stories.ts'
      )
    ).toBeFalsy();
  });

  it('should generate files with storybook enabled', async () => {
    tree = await runSchematic(
      'storybook-configuration',
      { name: projectName, configureCypress: false },
      tree
    );
    tree = await runSchematic('component', options, tree);

    expect(
      tree.exists(
        'libs/test-project/src/components/test-component/test-component.tsx'
      )
    ).toBeTruthy();
    expect(
      tree.exists(
        'libs/test-project/src/components/test-component/test-component.e2e.ts'
      )
    ).toBeTruthy();
    expect(
      tree.exists(
        'libs/test-project/src/components/test-component/test-component.spec.tsx'
      )
    ).toBeTruthy();
    expect(
      tree.exists(
        'libs/test-project/src/components/test-component/test-component.scss'
      )
    ).toBeTruthy();
    expect(
      tree.exists(
        'libs/test-project/src/components/test-component/test-component.stories.ts'
      )
    ).toBeTruthy();
  });

  it('should generate files in directory', async () => {
    tree = await runSchematic(
      'component',
      {
        ...options,
        directory: 'sub-dir',
      },
      tree
    );

    expect(
      tree.exists(
        'libs/test-project/src/components/sub-dir/test-component/test-component.tsx'
      )
    ).toBeTruthy();
    expect(
      tree.exists(
        'libs/test-project/src/components/sub-dir/test-component/test-component.e2e.ts'
      )
    ).toBeTruthy();
    expect(
      tree.exists(
        'libs/test-project/src/components/sub-dir/test-component/test-component.spec.tsx'
      )
    ).toBeTruthy();
    expect(
      tree.exists(
        'libs/test-project/src/components/sub-dir/test-component/test-component.scss'
      )
    ).toBeTruthy();
  });
});
