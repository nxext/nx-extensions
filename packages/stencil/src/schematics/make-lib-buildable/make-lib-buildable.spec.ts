import { Tree } from '@angular-devkit/schematics';
import { SchematicTestRunner } from '@angular-devkit/schematics/testing';
import { join } from 'path';

import { createTestUILib } from '../../utils/testing';
import { uniq } from '@nrwl/nx-plugin/testing';
import { MakeLibBuildableSchema } from './schema';
import { SupportedStyles } from '@nxext/stencil-core-utils';

describe('make-lib-buildable schematic', () => {
  let tree: Tree;
  const name = uniq('testproject');
  const options: MakeLibBuildableSchema = { name, style: SupportedStyles.css };

  const testRunner = new SchematicTestRunner(
    '@nxext/stencil',
    join(__dirname, '../../../collection.json')
  );

  beforeEach(async () => {
    tree = await createTestUILib(name, SupportedStyles.css, false);
  });

  it('should run successfully', async () => {
    await expect(
      testRunner
        .runSchematicAsync('make-lib-buildable', options, tree)
        .toPromise()
    ).resolves.not.toThrowError();
  });
});
