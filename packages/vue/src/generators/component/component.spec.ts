import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { Tree } from '@nx/devkit';
import { Linter } from '@nx/linter';
import { Schema } from './schema';
import { applicationGenerator } from '../application/application';
import { libraryGenerator } from '../library/library';
import { componentGenerator } from './component';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const devkit = require('@nx/devkit');

describe('component generator', () => {
  jest.spyOn(devkit, 'ensurePackage').mockReturnValue(Promise.resolve());

  let host: Tree;
  const libProjectName = 'my-lib';

  const options: Schema = {
    name: 'testcomponent',
    project: libProjectName,
    export: false,
  };

  beforeEach(() => {
    host = createTreeWithEmptyWorkspace({ layout: 'apps-libs' });
    libraryGenerator(host, {
      name: libProjectName,
      linter: Linter.None,
      unitTestRunner: 'none',
      skipFormat: true,
    });

    applicationGenerator(host, {
      name: 'my-app',
      linter: Linter.None,
      unitTestRunner: 'none',
      skipFormat: true,
    });
  });

  it('should generate files', async () => {
    await componentGenerator(host, options);

    host.listChanges().forEach((value) => {
      if (value.path.startsWith('lib/my-lib')) {
        console.log(value);
      }
    });
    expect(
      host.exists(`libs/my-lib/src/components/Testcomponent.vue`)
    ).toBeTruthy();
  });

  describe('--export', () => {
    it('should add to index.ts barrel', async () => {
      await componentGenerator(host, {
        name: 'hello',
        project: libProjectName,
        export: true,
      });

      const indexContent = host.read('libs/my-lib/src/index.ts', 'utf-8');

      expect(indexContent).toContain(
        `export { default as Hello } from './components/Hello.vue';`
      );
    });

    it('should not export from an app', async () => {
      await componentGenerator(host, {
        name: 'hello',
        project: 'my-app',
        export: true,
      });

      const indexContent = host.read('libs/my-lib/src/index.ts', 'utf-8');

      expect(indexContent).not.toContain(
        `import Hello from './components/Hello.vue';`
      );
    });
  });
});
