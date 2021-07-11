import { Tree } from '@nrwl/devkit';
import generator from './generator';
import { StorybookConfigureSchema } from './schema';
import { createTestUILib } from '../../utils/testing';
import { SupportedStyles } from '../../stencil-core-utils';

describe('storybook-configuration generator', () => {
  let host: Tree;
  const options: StorybookConfigureSchema = { name: 'test' };

  beforeEach(async () => {
    host = await createTestUILib(
      'test',
      SupportedStyles.css,
      false
    );
  });

  it('should create storybook folder', async () => {
    await generator(host, options);

    expect(host.exists('libs/test/.storybook')).toBeDefined();
    expect(host.exists('.storybook')).toBeDefined();
  });
});
