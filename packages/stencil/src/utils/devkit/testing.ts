import { SupportedStyles } from '../../stencil-core-utils/lib/devkit/style-plugins';
import { Tree } from '@nrwl/devkit';
import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import { libraryGenerator } from '../../schematics/library/schematic';

export async function createTestUILib(
  libName: string,
  style: SupportedStyles = SupportedStyles.css,
  buildable = true
): Promise<Tree> {
  const host = createTreeWithEmptyWorkspace();
  await libraryGenerator(host, {
    name: libName,
    style: style,
    buildable
  } as any);

  return host;
}
