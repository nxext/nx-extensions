import componentGenerator, { ComponentSchema } from './component';
import { createTestUILib, testNpmScope } from '../../utils/testing';
import { SupportedStyles } from '../../stencil-core-utils';
import { names, Tree } from '@nx/devkit';
import storybookConfigurationGenerator from '../storybook-configuration/generator';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const devkit = require('@nx/devkit');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const readNxVersionModule = require('../../utils/utillities');

describe('component schematic', () => {
  jest.spyOn(devkit, 'ensurePackage').mockReturnValue(Promise.resolve());
  jest.spyOn(readNxVersionModule, 'readNxVersion').mockReturnValue('15.7.0');

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
        'libs/test-project/src/components/test-component/test-component.stories.tsx'
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
    await storybookConfigurationGenerator(tree, {
      name: projectName,
      configureCypress: false,
    });
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
        'libs/test-project/src/components/test-component/test-component.stories.tsx'
      )
    ).toBeTruthy();
  });

  describe('generated stories.tsx file import statement', () => {
    let classPathValue: string;
    let className: string;
    let contents: string;

    const generate = async () => {
      await storybookConfigurationGenerator(tree, {
        name: projectName,
        configureCypress: false,
      });
      await componentGenerator(tree, options);

      classPathValue = `@${testNpmScope}/${options.project}/${options.name}`;
      className = names(options.name).className;
      contents = tree.read(
        'libs/test-project/src/components/test-component/test-component.stories.tsx',
        'utf-8'
      );
    };

    it('should set class name portion of import statement', async () => {
      await generate();
      expect(contents).toContain(className);
    });

    it('should set path portion of import statement', async () => {
      await generate();
      expect(contents).toContain(classPathValue);
    });

    it('should insert constructed import statement', async () => {
      await generate();
      const importStatement = `import { ${className} } from '${classPathValue}`;
      expect(contents).toContain(importStatement);
    });
  });
});
