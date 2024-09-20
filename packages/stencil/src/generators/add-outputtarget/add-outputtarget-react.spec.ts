import { createTestUILib } from '../../utils/testing';
import { uniq } from '@nx/plugin/testing';
import { Tree } from '@nx/devkit';
import { outputtargetGenerator } from './add-outputtarget';
import { AddOutputtargetSchematicSchema } from './schema';

xdescribe('add-outputtarget react', () => {
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

  describe('using react', () => {
    const reactOptions: AddOutputtargetSchematicSchema = {
      ...options,
      unitTestRunner: 'none',
      outputType: 'react',
    };

    it('should not generate default react library', async () => {
      await outputtargetGenerator(tree, reactOptions);

      expect(
        tree.exists(
          `libs/${projectName}-react/src/lib/${projectName}-react.tsx`
        )
      ).toBeFalsy();
      expect(
        tree.exists(
          `libs/${projectName}-react/src/lib/${projectName}-react.spec.tsx`
        )
      ).toBeFalsy();
      expect(
        tree.exists(
          `libs/${projectName}-react/src/lib/${projectName}-react.css`
        )
      ).toBeFalsy();

      const indexFile: Buffer = tree.read(
        `libs/${projectName}-react/src/index.ts`
      );
      expect(indexFile.toString()).toMatch(
        `export * from './generated/components';`
      );
    });

    it('should add reactOutputTarget', async () => {
      await outputtargetGenerator(tree, reactOptions);

      expect(
        tree
          .read(`libs/${projectName}/stencil.config.ts`)
          .includes(
            `import { reactOutputTarget } from '@stencil/react-output-target';`
          )
      ).toBeTruthy();

      expect(
        tree
          .read(`libs/${projectName}/stencil.config.ts`)
          .includes(`reactOutputTarget({`)
      ).toBeTruthy();
    });

    it('should be able to generate a publishable lib', async () => {
      await outputtargetGenerator(tree, {
        ...reactOptions,
        publishable: true,
        importPath: '@proj/mylib',
      });

      expect(tree.exists(`libs/${projectName}/package.json`)).toBeTruthy();
    });
  });
});
