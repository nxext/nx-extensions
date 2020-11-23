import { Tree } from '@angular-devkit/schematics';

import { createTestUILib, runSchematic } from '../../utils/testing';
import { uniq } from '@nrwl/nx-plugin/testing';
import { MakeLibBuildableSchema } from './schema';
import { SupportedStyles } from '../../stencil-core-utils';

describe('make-lib-buildable schematic', () => {
  let tree: Tree;
  const name = uniq('testproject');
  const options: MakeLibBuildableSchema = { name, style: SupportedStyles.css };

  beforeEach(async () => {
    tree = await createTestUILib(name, SupportedStyles.css, false);
  });

  it('should run successfully', async () => {
    await expect(
      runSchematic('make-lib-buildable', options, tree)
    ).resolves.not.toThrowError();
  });
});
