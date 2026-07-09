import {
  readJson,
  readProjectConfiguration,
  Tree,
  writeJson,
} from '@nx/devkit';
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { createTsSolutionTree } from '@nxext/common';
import { configurationGenerator } from './generator';
import { ConfigurationGeneratorSchema } from './schema';
// `@nx/angular`'s Node-only `/generators` and `/internal` subpaths have no
// top-level .d.ts stub for classic `moduleResolution: "node"` to resolve.
// @ts-expect-error -- see comment above; resolves fine at runtime
import { applicationGenerator } from '@nx/angular/generators';
// @ts-expect-error -- see comment above; resolves fine at runtime
import type { UnitTestRunner } from '@nx/angular/internal';

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
      unitTestRunner: 'jest' as UnitTestRunner,
    });
  });

  it('should add dependencies to package.json', async () => {
    await configurationGenerator(host, options);

    const packageJson = readJson(host, 'package.json');
    expect(packageJson.dependencies['@ionic/angular']).toBeDefined();
  });

  it('should update jest config', async () => {
    await configurationGenerator(host, options);

    const jestConfigPath = ['ts', 'cts', 'js', 'cjs']
      .map((ext) => `${projectRoot}/jest.config.${ext}`)
      .find((path) => host.exists(path));

    expect(jestConfigPath).toBeDefined();
    expect(host.read(jestConfigPath, 'utf8')).toContain(
      "transformIgnorePatterns: ['<rootDir>/node_modules/(?!(@ionic/core|@ionic/angular|@stencil/core|.*\\.mjs$))']",
    );
  });

  it('should remove app files', async () => {
    await configurationGenerator(host, options);

    expect(
      host.exists(`${projectRoot}/src/app/nx-welcome.component.ts`),
    ).toBeFalsy();
    expect(host.exists(`${projectRoot}/src/app/app.config.ts`)).toBeFalsy();
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
      ]),
    );
    expect(assets).not.toContain(`${projectRoot}/src/favicon.ico`);

    expect(styles).toEqual(
      expect.arrayContaining([`${projectRoot}/src/theme/variables.scss`]),
    );
  });

  it('should use the prefix', async () => {
    await configurationGenerator(host, options);

    expect(host.read(`${projectRoot}/src/index.html`, 'utf8')).toContain(
      'app-root',
    );
    expect(
      host.read(`${projectRoot}/src/app/app.component.ts`, 'utf8'),
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

  describe('TS-solution mode', () => {
    let tsSolutionTree: Tree;
    const tsProjectRoot = `packages/${appName}`;

    beforeEach(() => {
      tsSolutionTree = createTsSolutionTree();
      // `@nx/angular`'s own `application` generator still calls
      // `assertNotUsingTsSolutionSetup` itself (checked directly against
      // the installed @nx/angular@23.0.1 dist - its `application` generator
      // has not been migrated for TS-solution setups yet), so it cannot be
      // used here to scaffold the pre-existing app the way the suite above
      // does. Instead the package.json-based project shape it *would*
      // produce is fabricated directly (see @nx/angular's
      // `create-project.js`: `targets.build.options.assets`/`.styles` are
      // always plain arrays, with no defensive fallback), so
      // `updateWorkspace`'s un-guarded
      // `projectConfig.targets.build.options.assets = [...]` has something
      // to spread.
      writeJson(tsSolutionTree, `${tsProjectRoot}/package.json`, {
        name: appName,
        version: '0.0.1',
        nx: {
          prefix: 'app',
          targets: {
            build: {
              executor: '@angular-devkit/build-angular:browser',
              options: {
                outputPath: `dist/${tsProjectRoot}`,
                assets: [{ glob: '**/*', input: `${tsProjectRoot}/public` }],
                styles: [`${tsProjectRoot}/src/styles.scss`],
              },
            },
          },
        },
      });
    });

    it('configures Ionic Angular for a package.json-based (TS-solution) project without crashing', async () => {
      await configurationGenerator(tsSolutionTree, {
        ...options,
        capacitor: false,
      });

      expect(
        tsSolutionTree.exists(`${tsProjectRoot}/ionic.config.json`),
      ).toBeTruthy();
      expect(
        tsSolutionTree.exists(`${tsProjectRoot}/src/app/app.component.ts`),
      ).toBeTruthy();

      // updateWorkspace patches targets via updateProjectConfiguration,
      // which - for a package.json-based project - writes back into
      // `package.json`'s `nx` field (Nx core dispatches on which of
      // project.json/package.json exists; see
      // `nx/src/generators/utils/project-configuration.js`).
      const packageJson = readJson(
        tsSolutionTree,
        `${tsProjectRoot}/package.json`,
      );
      expect(packageJson.nx.targets.build.options.styles).toEqual(
        expect.arrayContaining([`${tsProjectRoot}/src/theme/variables.scss`]),
      );
    });

    it('also configures Capacitor transitively when --capacitor is set', async () => {
      await configurationGenerator(tsSolutionTree, {
        ...options,
        capacitor: true,
      });

      expect(
        tsSolutionTree.exists(`${tsProjectRoot}/capacitor.config.ts`),
      ).toBeTruthy();
    });
  });
});
