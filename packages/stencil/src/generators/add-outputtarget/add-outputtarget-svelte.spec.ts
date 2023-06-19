import { createTestUILib } from '../../utils/testing';
import { uniq } from '@nx/plugin/testing';
import { Tree } from '@nx/devkit';
import { outputtargetGenerator } from './add-outputtarget';
import { AddOutputtargetSchematicSchema } from './schema';

describe('add-outputtarget svelte', () => {
  let tree: Tree;
  const projectName = uniq('testproject');
  const options = {
    projectName: projectName,
    publishable: false,
    skipFormat: false,
  };

  beforeEach(async () => {
    tree = await createTestUILib(projectName);
    tree.write(
      'package.json',
      `
      {
        "name": "test-name",
        "dependencies": {},
        "devDependencies": {
          "@nx/workspace": "0.0.0"
        }
      }
    `
    );
  });

  describe('using svelte', () => {
    const svelteOptions: AddOutputtargetSchematicSchema = {
      ...options,
      unitTestRunner: 'none',
      outputType: 'svelte',
    };

    it('should generate default svelte library', async () => {
      await outputtargetGenerator(tree, svelteOptions);

      expect(
        tree.exists(
          `libs/${projectName}-svelte/src/lib/${projectName}-react.tsx`
        )
      ).toBeFalsy();
      expect(
        tree.exists(
          `libs/${projectName}-svelte/src/lib/${projectName}-react.spec.tsx`
        )
      ).toBeFalsy();
      expect(
        tree.exists(
          `libs/${projectName}-svelte/src/lib/${projectName}-react.css`
        )
      ).toBeFalsy();

      const indexFile: Buffer = tree.read(
        `libs/${projectName}-svelte/src/index.ts`
      );
      expect(indexFile.toString()).toMatch(
        `export * from './generated/components';`
      );
    });

    it('should add svelteOutputTarget', async () => {
      await outputtargetGenerator(tree, svelteOptions);

      expect(
        tree
          .read(`libs/${projectName}/stencil.config.ts`)
          .includes(
            `import { svelteOutputTarget } from '@stencil/svelte-output-target';`
          )
      ).toBeTruthy();

      expect(
        tree
          .read(`libs/${projectName}/stencil.config.ts`)
          .includes(`svelteOutputTarget({`)
      ).toBeTruthy();
    });

    it('should be able to generate a publishable lib', async () => {
      await outputtargetGenerator(tree, {
        ...svelteOptions,
        publishable: true,
        importPath: '@proj/mylib',
      });

      expect(tree.exists(`libs/${projectName}/package.json`)).toBeTruthy();
    });
  });
});
