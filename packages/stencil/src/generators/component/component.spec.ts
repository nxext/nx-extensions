import componentGenerator, { ComponentSchema } from './component';
import { createTestUILib } from '../../utils/testing';
import { SupportedStyles } from '../../stencil-core-utils';
import { Tree } from '@nrwl/devkit';
import storybookConfigurationGenerator from '../storybook-configuration/generator';

describe('component schematic', () => {
  let tree: Tree;
  const projectName = 'test-project';
  const options: ComponentSchema = {
    name: 'test-component',
    project: projectName,
  };

  beforeEach(async () => {
    tree = await createTestUILib(projectName, SupportedStyles.scss);
  });

  it('should generate files', async () => {
    await componentGenerator(tree, options);

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

  it('should generate files in directory', async () => {
    await componentGenerator(tree, {
      ...options,
      directory: 'sub-dir',
    });

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

  it('should generate files with storybook enabled', async () => {
    await storybookConfigurationGenerator(tree, { name: projectName, configureCypress: false });
    await componentGenerator(tree, options);

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
        'libs/test-project/src/components/test-component/test-component.stories.jsx'
      )
    ).toBeTruthy();
  });
});
