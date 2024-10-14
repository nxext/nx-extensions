import { readJson, readProjectConfiguration, Tree } from '@nx/devkit';
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { configurationGenerator } from './generator';
import { ConfigurationGeneratorSchema } from './schema';
import { applicationGenerator } from '@nx/angular/generators';

describe('configuration schematic', () => {
  let host: Tree;
  const appName = 'my-app';
  const projectRoot = `apps/${appName}`;
  const options: ConfigurationGeneratorSchema = {
    project: appName,
    capacitor: true,
    skipFormat: true,
  };

  beforeEach(async () => {
    host = createTreeWithEmptyWorkspace({ layout: 'apps-libs' });
    await applicationGenerator(host, {
      directory: projectRoot,
      prefix: 'app',
      skipFormat: true,
    });
  });

  it('should add dependencies to package.json', async () => {
    await configurationGenerator(host, options);

    const packageJson = readJson(host, 'package.json');
    expect(packageJson.dependencies['@ionic/angular']).toBeDefined();
  });

  it('should update jest config', async () => {
    await configurationGenerator(host, options);

    expect(host.read(`${projectRoot}/jest.config.ts`, 'utf8')).toContain(
      "transformIgnorePatterns: ['<rootDir>/node_modules/(?!(@ionic/core|@ionic/angular|@stencil/core|.*\\.mjs$))']"
    );
  });

  it('should update assets in project configuration', async () => {
    await configurationGenerator(host, options);
    const project = readProjectConfiguration(host, appName);

    const assets = project.targets.build.options.assets;
    const styles = project.targets.build.options.styles;

    expect(assets).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          input: 'node_modules/ionicons/dist/ionicons/svg',
        }),
      ])
    );
    expect(assets).not.toContain(`${projectRoot}/src/favicon.ico`);

    expect(styles).toEqual(
      expect.arrayContaining([`${projectRoot}/src/theme/variables.scss`])
    );
  });

  it('should use the prefix', async () => {
    await configurationGenerator(host, options);

    expect(host.read(`${projectRoot}/src/index.html`, 'utf8')).toContain(
      'app-root'
    );
    expect(
      host.read(`${projectRoot}/src/app/app.component.ts`, 'utf8')
    ).toMatch(/selector: 'app-root'/);
  });

  describe('--capacitor', () => {
    describe('true', () => {
      it('should generate Capacitor project', async () => {
        await configurationGenerator(host, { ...options, capacitor: true });

        expect(host.exists(`${projectRoot}/capacitor.config.ts`)).toBeDefined();
      });
    });
  });
});
