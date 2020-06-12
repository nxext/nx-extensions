import { Tree } from '@angular-devkit/schematics';
import { SchematicTestRunner } from '@angular-devkit/schematics/testing';
import { join } from 'path';
import { ComponentSchema } from './component';
import { createTestUILib, runSchematic } from '../../utils/testing';

describe('component schematic', () => {
  let tree: Tree;
  const projectName = 'test-project';
  const options: ComponentSchema = {
    name: 'test-component',
    project: projectName,
    storybook: false,
  };

  const testRunner = new SchematicTestRunner(
    '@nxext/stencil',
    join(__dirname, '../../../collection.json')
  );

  beforeEach(async () => {
    tree = await createTestUILib(projectName, 'scss');
  });

  it('should run successfully', async () => {
    await expect(
      testRunner.runSchematicAsync('component', options, tree).toPromise()
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
      'component',
      {
        ...options,
        storybook: true,
      },
      tree
    );

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
