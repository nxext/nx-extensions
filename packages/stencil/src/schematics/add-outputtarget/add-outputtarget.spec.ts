import { Tree } from '@angular-devkit/schematics';
import { createTestUILib, runSchematic } from '../../utils/testing';
import { uniq } from '@nrwl/nx-plugin/testing';
import { AddOutputtargetSchematicSchema } from './add-outputtarget';
import { names } from '@nrwl/devkit';

describe('schematics:add-outputtarget', () => {
  let tree: Tree;
  const projectName = uniq('testproject');
  const options = { projectName: projectName, publishable: false };
  const reactOptions: AddOutputtargetSchematicSchema = {
    ...options,
    outputType: 'react',
  };
  const angularOptions: AddOutputtargetSchematicSchema = {
    ...options,
    outputType: 'angular',
  };

  beforeEach(async () => {
    tree = await createTestUILib(projectName);
  });

  describe('using react', () => {
    it('should not generate default react library', async () => {
      tree = await runSchematic('add-outputtarget', reactOptions, tree);

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
    xit('should generate default angular library', async () => {
      tree = await runSchematic('add-outputtarget', angularOptions, tree);

      expect(
        tree.exists(
          `libs/${projectName}-angular/src/lib/${
            names(projectName + '-angular').fileName
          }.module.ts`
        )
      ).toBeTruthy();
    });
  });
});
