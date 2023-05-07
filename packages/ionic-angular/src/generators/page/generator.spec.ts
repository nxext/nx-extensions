import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { Tree, updateJson } from '@nx/devkit';

import { pageGenerator } from './generator';
import { PageGeneratorSchema } from './schema';
import { ApplicationGeneratorSchema } from '../application/schema';
import { applicationGenerator } from '../application/generator';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const devkit = require('@nx/devkit');

describe('page generator', () => {
  jest.spyOn(devkit, 'ensurePackage').mockReturnValue(Promise.resolve());

  let host: Tree;

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
    host = createTreeWithEmptyWorkspace({ layout: 'apps-libs' });
    await applicationGenerator(host, projectOptions);
  });

  it('should create page files', async () => {
    await pageGenerator(host, options);

    expect(
      host.exists(
        `${projectRoot}/src/app/${options.name}/${options.name}-routing.module.ts`
      )
    ).toBeTruthy();

    expect(
      host.exists(
        `${projectRoot}/src/app/${options.name}/${options.name}.page.html`
      )
    ).toBeTruthy();

    expect(
      host.exists(
        `${projectRoot}/src/app/${options.name}/${options.name}.page.spec.ts`
      )
    ).toBeTruthy();

    expect(
      host.exists(
        `${projectRoot}/src/app/${options.name}/${options.name}.module.ts`
      )
    ).toBeTruthy();

    expect(
      host.exists(
        `${projectRoot}/src/app/${options.name}/${options.name}.page.scss`
      )
    ).toBeTruthy();

    expect(
      host.exists(
        `${projectRoot}/src/app/${options.name}/${options.name}.page.ts`
      )
    ).toBeTruthy();
  });

  describe('--directory', () => {
    it('should create page files inside directory', async () => {
      await pageGenerator(host, { ...options, directory: 'myDir' });

      expect(
        host.exists(
          `${projectRoot}/src/app/myDir/${options.name}/${options.name}-routing.module.ts`
        )
      ).toBeTruthy();

      expect(
        host.exists(
          `${projectRoot}/src/app/myDir/${options.name}/${options.name}.page.html`
        )
      ).toBeTruthy();

      expect(
        host.exists(
          `${projectRoot}/src/app/myDir/${options.name}/${options.name}.page.spec.ts`
        )
      ).toBeTruthy();

      expect(
        host.exists(
          `${projectRoot}/src/app/myDir/${options.name}/${options.name}.module.ts`
        )
      ).toBeTruthy();

      expect(
        host.exists(
          `${projectRoot}/src/app/myDir/${options.name}/${options.name}.page.scss`
        )
      ).toBeTruthy();

      expect(
        host.exists(
          `${projectRoot}/src/app/myDir/${options.name}/${options.name}.page.ts`
        )
      ).toBeTruthy();
    });
  });
});
