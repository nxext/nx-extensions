import { createTestUILib } from '../../utils/testing';
import { uniq } from '@nx/plugin/testing';
import { Tree } from '@nx/devkit';
import { outputtargetGenerator } from './add-outputtarget';
import { AddOutputtargetSchematicSchema } from './schema';

xdescribe('add-outputtarget vue', () => {
  let tree: Tree;
  const projectName = uniq('testprojekt');
  const projectAppDirectory = `apps/${projectName}`;
  const projectLibDirectory = `libs/${projectName}`;
  const options = {
    projectName: projectName,
    publishable: false,
    skipFormat: false,
  };

  beforeEach(async () => {
    tree = await createTestUILib(projectLibDirectory);
  });

  describe('using vue', () => {
    const vueOptions: AddOutputtargetSchematicSchema = {
      ...options,
      unitTestRunner: 'none',
      outputType: 'vue',
    };

    it('should not generate default vue library', async () => {
      await outputtargetGenerator(tree, vueOptions);

      expect(
        tree.exists(`libs/${projectName}-vue/src/lib/${projectName}-vue.tsx`)
      ).toBeFalsy();
      expect(
        tree.exists(
          `libs/${projectName}-vue/src/lib/${projectName}-vue.spec.tsx`
        )
      ).toBeFalsy();
      expect(
        tree.exists(`libs/${projectName}-vue/src/lib/${projectName}-vue.css`)
      ).toBeFalsy();

      const indexFile: Buffer = tree.read(
        `libs/${projectName}-vue/src/index.ts`
      );
      expect(indexFile.toString()).toMatch(
        `export * from './generated/components';`
      );
    });

    it('should add vueOutputTarget', async () => {
      await outputtargetGenerator(tree, vueOptions);

      expect(
        tree
          .read(`libs/${projectName}/stencil.config.ts`)
          .includes(
            `import { vueOutputTarget } from '@stencil/vue-output-target';`
          )
      ).toBeTruthy();

      expect(
        tree
          .read(`libs/${projectName}/stencil.config.ts`)
          .includes(`vueOutputTarget({`)
      ).toBeTruthy();
    });

    it('should be able to generate a publishable lib', async () => {
      await outputtargetGenerator(tree, {
        ...vueOptions,
        publishable: true,
        importPath: '@proj/mylib',
      });

      expect(tree.exists(`libs/${projectName}/package.json`)).toBeTruthy();
    });
  });
});
