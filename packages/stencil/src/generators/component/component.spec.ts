import componentGenerator, { ComponentSchema } from './component';
import { createTestUILib } from '../../utils/devkit/testing';
import { SupportedStyles } from '../../stencil-core-utils';
import { Tree } from '@nrwl/devkit';

describe('component generator', () => {
  let host: Tree;
  const projectName = 'test-project';
  const options: ComponentSchema = {
    name: 'test-component',
    project: projectName
  };

  beforeEach(async () => {
    host = await createTestUILib(projectName, SupportedStyles.scss);
  });

  it('should generate files', async () => {
    await componentGenerator(host, options);

    expect(
      host.exists(
        'libs/test-project/src/components/test-component/test-component.tsx'
      )
    ).toBeTruthy();
    expect(
      host.exists(
        'libs/test-project/src/components/test-component/test-component.e2e.ts'
      )
    ).toBeTruthy();
    expect(
      host.exists(
        'libs/test-project/src/components/test-component/test-component.spec.tsx'
      )
    ).toBeTruthy();
    expect(
      host.exists(
        'libs/test-project/src/components/test-component/test-component.scss'
      )
    ).toBeTruthy();
    expect(
      host.exists(
        'libs/test-project/src/components/test-component/test-component.stories.ts'
      )
    ).toBeFalsy();
  });

  xit('should generate files with storybook enabled', async () => {
    /*host = await runSchematic(
      'storybook-configuration',
      { name: projectName, configureCypress: false },
      host
    );*/
    await componentGenerator(host, options);

    expect(
      host.exists(
        'libs/test-project/src/components/test-component/test-component.tsx'
      )
    ).toBeTruthy();
    expect(
      host.exists(
        'libs/test-project/src/components/test-component/test-component.e2e.ts'
      )
    ).toBeTruthy();
    expect(
      host.exists(
        'libs/test-project/src/components/test-component/test-component.spec.tsx'
      )
    ).toBeTruthy();
    expect(
      host.exists(
        'libs/test-project/src/components/test-component/test-component.scss'
      )
    ).toBeTruthy();
    expect(
      host.exists(
        'libs/test-project/src/components/test-component/test-component.stories.ts'
      )
    ).toBeTruthy();
  });

  it('should generate files in directory', async () => {
    await componentGenerator(host, {
      ...options,
      directory: 'sub-dir',
    });

    expect(
      host.exists(
        'libs/test-project/src/components/sub-dir/test-component/test-component.tsx'
      )
    ).toBeTruthy();
    expect(
      host.exists(
        'libs/test-project/src/components/sub-dir/test-component/test-component.e2e.ts'
      )
    ).toBeTruthy();
    expect(
      host.exists(
        'libs/test-project/src/components/sub-dir/test-component/test-component.spec.tsx'
      )
    ).toBeTruthy();
    expect(
      host.exists(
        'libs/test-project/src/components/sub-dir/test-component/test-component.scss'
      )
    ).toBeTruthy();
  });
});
