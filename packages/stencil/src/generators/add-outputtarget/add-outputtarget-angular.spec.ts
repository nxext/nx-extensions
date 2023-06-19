import { createTestUILib } from '../../utils/testing';
import { uniq } from '@nx/plugin/testing';
import { names, Tree } from '@nx/devkit';
import { outputtargetGenerator } from './add-outputtarget';
import { AddOutputtargetSchematicSchema } from './schema';

xdescribe('add-outputtarget angular', () => {
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

  describe('using angular', () => {
    const angularOptions: AddOutputtargetSchematicSchema = {
      ...options,
      unitTestRunner: 'none',
      outputType: 'angular',
    };

    it('should generate default angular library', async () => {
      await outputtargetGenerator(tree, angularOptions);

      const fileName = names(projectName + '-angular').fileName;
      expect(
        tree.exists(`libs/${projectName}-angular/src/lib/${fileName}.module.ts`)
      ).toBeTruthy();
    });

    it('should add default directive definitions', async () => {
      await outputtargetGenerator(tree, angularOptions);

      const fileName = names(projectName + '-angular').fileName;
      expect(
        tree
          .read(`libs/${projectName}-angular/src/lib/${fileName}.module.ts`)
          .includes(`import { DIRECTIVES } from '../generated/directives';`)
      ).toBeTruthy();
      expect(
        tree
          .read(`libs/${projectName}-angular/src/lib/${fileName}.module.ts`)
          .includes(`declarations: [...DIRECTIVES]`)
      ).toBeTruthy();
      expect(
        tree
          .read(`libs/${projectName}-angular/src/lib/${fileName}.module.ts`)
          .includes(`exports: [...DIRECTIVES]`)
      ).toBeTruthy();
    });

    it('should add angularOutputTarget', async () => {
      await outputtargetGenerator(tree, angularOptions);

      expect(
        tree
          .read(`libs/${projectName}/stencil.config.ts`)
          .includes(
            `import { angularOutputTarget, ValueAccessorConfig } from '@stencil/angular-output-target';`
          )
      ).toBeTruthy();

      expect(
        tree
          .read(`libs/${projectName}/stencil.config.ts`)
          .includes(
            `const angularValueAccessorBindings: ValueAccessorConfig[] = [];`
          )
      ).toBeTruthy();

      expect(
        tree
          .read(`libs/${projectName}/stencil.config.ts`)
          .includes(`angularOutputTarget({`)
      ).toBeTruthy();
    });

    it('should be able to generate a publishable lib', async () => {
      await outputtargetGenerator(tree, {
        ...angularOptions,
        publishable: true,
        importPath: '@proj/mylib',
      });

      expect(tree.exists(`libs/${projectName}/package.json`)).toBeTruthy();
    });
  });
});
