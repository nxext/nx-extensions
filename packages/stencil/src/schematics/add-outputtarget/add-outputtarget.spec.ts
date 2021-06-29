import { createTestUILib } from '../../utils/devkit/testing';
import { uniq } from '@nrwl/nx-plugin/testing';
import { names, Tree } from '@nrwl/devkit';
import { outputtargetGenerator } from './add-outputtarget';
import { AddOutputtargetSchematicSchema } from './schema';

describe('schematics:add-outputtarget', () => {
  let tree: Tree;
  const projectName = uniq('testproject');
  const options = { projectName: projectName, publishable: false, skipFormat: false };
  const reactOptions: AddOutputtargetSchematicSchema = {
    ...options,
    unitTestRunner: 'none',
    outputType: 'react'
  };
  const angularOptions: AddOutputtargetSchematicSchema = {
    ...options,
    unitTestRunner: 'none',
    outputType: 'angular'
  };

  beforeEach(async () => {
    tree = await createTestUILib(projectName);
  });

  describe('using react', () => {
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
  });

  describe('using angular', () => {
    it('should generate default angular library', async () => {
      await outputtargetGenerator(tree, angularOptions);

      const fileName = names(projectName + '-angular').fileName;
      expect(
        tree.exists(
          `libs/${projectName}-angular/src/lib/${fileName}.module.ts`
        )
      ).toBeTruthy();
    });
  });
});
