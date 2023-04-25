import { createTestUILib } from '../../utils/testing';
import { uniq } from '@nx/plugin/testing';
import { Tree } from '@nx/devkit';
import { outputtargetGenerator } from './add-outputtarget';
import { AddOutputtargetSchematicSchema } from './schema';

describe('add-outputtarget vue', () => {
  let tree: Tree;
  const projectName = uniq('testproject');
  const options = {
    projectName: projectName,
    publishable: false,
    skipFormat: false,
  };

  beforeEach(async () => {
    tree = await createTestUILib(projectName);
  });

  xdescribe('using vue', () => {
    const vueOptions: AddOutputtargetSchematicSchema = {
      ...options,
      unitTestRunner: 'none',
      outputType: 'vue',
    };

    it('should add vueOutputTarget', async () => {
      await outputtargetGenerator(tree, vueOptions);

      expect(
        tree
          .read(`libs/${projectName}/stencil.config.ts`)
          .includes(
            `import { vueOutputTarget, ComponentModelConfig } from '@stencil/vue-output-target';`
          )
      ).toBeTruthy();

      expect(
        tree
          .read(`libs/${projectName}/stencil.config.ts`)
          .includes(`const vueComponentModels: ComponentModelConfig[] = [];`)
      ).toBeTruthy();

      expect(
        tree
          .read(`libs/${projectName}/stencil.config.ts`)
          .includes(`vueOutputTarget({`)
      ).toBeTruthy();
    });

    it('should be able to generate a publishable lib', async () => {
      await outputtargetGenerator(tree, { ...vueOptions, publishable: true });

      expect(tree.exists(`libs/${projectName}/package.json`)).toBeTruthy();
    });
  });
});
