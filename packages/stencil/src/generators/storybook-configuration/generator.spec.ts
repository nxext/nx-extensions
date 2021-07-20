import generator from './generator';
import { StorybookConfigureSchema } from './schema';
import { createTestUILib } from '../../utils/testing';
import { SupportedStyles } from '../../stencil-core-utils';

describe('storybook-configuration generator', () => {
    const options: StorybookConfigureSchema = { name: 'test', configureCypress: false };

  it('should create storybook folder', async () => {
    const host = await createTestUILib(
      'test',
      SupportedStyles.css,
      true
    );
    await generator(host, options);

    expect(host.exists('libs/test/.storybook')).toBeTruthy();
    expect(host.exists('.storybook')).toBeTruthy();
  });

  it('should fail if library not buildable', async () => {
    const host = await createTestUILib(
      'test',
      SupportedStyles.css,
      false
    );
    await generator(host, options);

    expect(host.exists('libs/test/.storybook')).toBeFalsy();
    expect(host.exists('.storybook')).toBeFalsy();
  })
});
