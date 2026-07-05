import { readJson } from '@nx/devkit';
import { storybookConfigurationGenerator } from './generator';
import { StorybookConfigureSchema } from './schema';
import { createTestUILib } from '../../utils/testing';
import { SupportedStyles } from '../../stencil-core-utils';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const devkit = require('@nx/devkit');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const readNxVersionModule = require('../../utils/utillities');

describe('storybook-configuration generator', () => {
  jest.spyOn(devkit, 'ensurePackage').mockReturnValue(Promise.resolve());
  jest.spyOn(readNxVersionModule, 'readNxVersion').mockReturnValue('17.0.0');
  // @nx/storybook's ensureDependencies only adds `@storybook/web-components`
  // (the builder-less package pnpm also needs) when it detects pnpm, which it
  // does via `npm_config_user_agent` — set locally by `pnpm nx test`, but
  // absent on Nx Cloud's distributed agents. Force it so the assertions below
  // are deterministic rather than dependent on how the test process was invoked.
  jest.spyOn(devkit, 'detectPackageManager').mockReturnValue('pnpm');

  const options: StorybookConfigureSchema = {
    name: 'test',
    configureCypress: false,
  };

  it('should create storybook folder', async () => {
    const host = await createTestUILib('libs/test', SupportedStyles.css, true);
    await storybookConfigurationGenerator(host, options);

    expect(host.exists('libs/test/.storybook')).toBeTruthy();
    expect(host.exists('libs/test/.storybook/main.ts')).toBeTruthy();
  });

  it('should fail if library not buildable', async () => {
    const host = await createTestUILib('libs/test', SupportedStyles.css, false);
    await storybookConfigurationGenerator(host, options);

    expect(host.exists('libs/test/.storybook')).toBeFalsy();
  });

  it('should install the modern web-components-vite framework, not the discontinued webpack5 packages', async () => {
    const host = await createTestUILib('libs/test', SupportedStyles.css, true);
    await storybookConfigurationGenerator(host, options);

    const packageJson = readJson(host, 'package.json');
    const devDependencies = packageJson.devDependencies ?? {};

    expect(devDependencies['@storybook/web-components-vite']).toBeDefined();
    expect(devDependencies['@storybook/web-components']).toBeDefined();
    expect(devDependencies['lit']).toBeDefined();
    expect(devDependencies['vite']).toBeDefined();

    expect(devDependencies['@storybook/manager-webpack5']).toBeUndefined();
    expect(devDependencies['@storybook/builder-webpack5']).toBeUndefined();
    expect(devDependencies['@storybook/html-webpack5']).toBeUndefined();
    expect(devDependencies['lit-html']).toBeUndefined();
  });

  it('should wire up the Stencil custom-elements loader in preview.ts', async () => {
    const host = await createTestUILib('libs/test', SupportedStyles.css, true);
    await storybookConfigurationGenerator(host, options);

    const preview = host.read('libs/test/.storybook/preview.ts', 'utf-8');
    expect(preview).toContain('defineCustomElements');
    expect(preview).toContain("from 'lit'");
  });

  it("should point the stories glob at Stencil's src/components, not @nx/storybook's default src/lib", async () => {
    const host = await createTestUILib('libs/test', SupportedStyles.css, true);
    await storybookConfigurationGenerator(host, options);

    const main = host.read('libs/test/.storybook/main.ts', 'utf-8');
    expect(main).toContain('src/components');
    expect(main).not.toContain('src/lib');
  });
});
