import { Tree } from '@angular-devkit/schematics';
import { SchematicTestRunner } from '@angular-devkit/schematics/testing';
import { join } from 'path';
import { createTestUILib } from '../../utils/testing';
import { uniq } from '@nrwl/nx-plugin/testing';
import { AddOutputtargetSchematicSchema } from './add-outputtarget';
import { log } from 'util';

describe('schematics:add-outputtarget', () => {
  let tree: Tree;
  const projectName = uniq('testproject');
  const options = { projectName: projectName };
  const reactOptions: AddOutputtargetSchematicSchema = {
    ...options,
    outputType: 'react',
  };
  const angularOptions: AddOutputtargetSchematicSchema = {
    ...options,
    outputType: 'angular',
  };

  const testRunner = new SchematicTestRunner(
    '@nxext/stencil',
    join(__dirname, '../../../collection.json')
  );

  beforeEach(async () => {
    tree = await createTestUILib(projectName);
  });

  describe('using react', () => {
    it('should not generate default react library', async () => {
      tree = await testRunner
        .runSchematicAsync('add-outputtarget', reactOptions, tree)
        .toPromise();

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

      //log(tree.read(`libs/${projectName}/stencil.config.ts`).toString());
    });
  });

  /*describe('using angular', () => {
    it('should run successfully', async () => {
      await expect(testRunner.runSchematicAsync(
        'add-outputtarget',
        angularOptions,
        tree
        ).toPromise()
      ).resolves.not.toThrowError();
    });
  });*/
});
