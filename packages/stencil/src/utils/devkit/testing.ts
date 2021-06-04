import { SupportedStyles } from '../../stencil-core-utils';
import { Tree } from '@nrwl/devkit';
import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import { libraryGenerator } from '../../generators/library/schematic';

export async function createTestUILib(
  libName: string,
  style: SupportedStyles = SupportedStyles.css,
  buildable = true
): Promise<Tree> {
  const host = createTreeWithEmptyWorkspace();
  await libraryGenerator(host, {
    name: libName,
    style: style,
    buildable,
    publishable: false
  });

  return host;
}
