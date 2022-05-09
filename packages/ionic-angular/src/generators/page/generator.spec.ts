import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import { Tree } from '@nrwl/devkit';

import { pageGenerator } from './generator';
import { PageGeneratorSchema } from './schema';
import { ApplicationGeneratorSchema } from '../application/schema';
import { applicationGenerator } from '../application/generator';

describe('page generator', () => {
  let appTree: Tree;

  const projectOptions: ApplicationGeneratorSchema = {
    name: 'my-app',
    template: 'blank',
    unitTestRunner: 'jest',
    e2eTestRunner: 'cypress',
    capacitor: false,
    skipFormat: false,
  };

  const options: PageGeneratorSchema = { project: 'my-app', name: 'test' };
  const projectRoot = `apps/${options.project}`;

  beforeEach(async () => {
    appTree = createTreeWithEmptyWorkspace();
    await applicationGenerator(appTree, projectOptions);
  });

  it('should create page files', async () => {
    await pageGenerator(appTree, options);

    expect(
      appTree.exists(
        `${projectRoot}/src/app/${options.name}/${options.name}-routing.module.ts`
      )
    ).toBeTruthy();

    expect(
      appTree.exists(
        `${projectRoot}/src/app/${options.name}/${options.name}.page.html`
      )
    ).toBeTruthy();

    expect(
      appTree.exists(
        `${projectRoot}/src/app/${options.name}/${options.name}.page.spec.ts`
      )
    ).toBeTruthy();

    expect(
      appTree.exists(
        `${projectRoot}/src/app/${options.name}/${options.name}.module.ts`
      )
    ).toBeTruthy();

    expect(
      appTree.exists(
        `${projectRoot}/src/app/${options.name}/${options.name}.page.scss`
      )
    ).toBeTruthy();

    expect(
      appTree.exists(
        `${projectRoot}/src/app/${options.name}/${options.name}.page.ts`
      )
    ).toBeTruthy();
  });

  describe('--directory', () => {
    it('should create page files inside directory', async () => {
      await pageGenerator(appTree, { ...options, directory: 'myDir' });

      expect(
        appTree.exists(
          `${projectRoot}/src/app/myDir/${options.name}/${options.name}-routing.module.ts`
        )
      ).toBeTruthy();

      expect(
        appTree.exists(
          `${projectRoot}/src/app/myDir/${options.name}/${options.name}.page.html`
        )
      ).toBeTruthy();

      expect(
        appTree.exists(
          `${projectRoot}/src/app/myDir/${options.name}/${options.name}.page.spec.ts`
        )
      ).toBeTruthy();

      expect(
        appTree.exists(
          `${projectRoot}/src/app/myDir/${options.name}/${options.name}.module.ts`
        )
      ).toBeTruthy();

      expect(
        appTree.exists(
          `${projectRoot}/src/app/myDir/${options.name}/${options.name}.page.scss`
        )
      ).toBeTruthy();

      expect(
        appTree.exists(
          `${projectRoot}/src/app/myDir/${options.name}/${options.name}.page.ts`
        )
      ).toBeTruthy();
    });
  });
});
