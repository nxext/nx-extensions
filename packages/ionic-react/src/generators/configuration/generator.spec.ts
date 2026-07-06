import { readJson, readProjectConfiguration, Tree, writeJson } from '@nx/devkit';
// `@nx/angular`'s Node-only `/generators` and `/internal` subpaths have no
// top-level .d.ts stub for classic `moduleResolution: "node"` to resolve.
// @ts-expect-error -- see comment above; resolves fine at runtime
import { applicationGenerator } from '@nx/angular/generators';
// @ts-expect-error -- see comment above; resolves fine at runtime
import type { UnitTestRunner } from '@nx/angular/internal';
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { createTsSolutionTree } from '@nxext/common';
import { configurationGenerator } from './generator';
import { ConfigurationGeneratorSchema } from './schema';

describe('application', () => {
  let host: Tree;

  const options: ConfigurationGeneratorSchema = {
    project: 'my-app',
    capacitor: false,
    skipFormat: true,
  };

  const projectRoot = `apps/${options.project}`;

  function testGeneratedFiles(
    tree: Tree,
    options: ConfigurationGeneratorSchema
  ) {
    // Common files
    expect(tree.exists(`${projectRoot}/src/index.html`)).toBeTruthy();
    expect(tree.exists(`${projectRoot}/src/manifest.json`)).toBeTruthy();
    expect(tree.exists(`${projectRoot}/public/favicon.png`)).toBeTruthy();

    // Starter template
    expect(tree.exists(`${projectRoot}/src/App.tsx`)).toBeTruthy();
    expect(tree.exists(`${projectRoot}/src/pages/Tab1.tsx`)).toBeTruthy();
    expect(tree.exists(`${projectRoot}/src/pages/Tab1.css`)).toBeTruthy();
    expect(
      tree.exists(`${projectRoot}/src/components/ExploreContainer.css`)
    ).toBeTruthy();
    expect(
      tree.exists(`${projectRoot}/src/components/ExploreContainer.tsx`)
    ).toBeTruthy();

    // Capacitor files
    if (options.capacitor) {
      expect(tree.exists(`${projectRoot}/capacitor.config.ts`)).toBeTruthy();
    }
  }

  beforeEach(async () => {
    host = createTreeWithEmptyWorkspace({ layout: 'apps-libs' });
    await applicationGenerator(host, {
      directory: projectRoot,
      skipFormat: true,
      unitTestRunner: 'none' as UnitTestRunner,
    });
  });

  it('should add dependencies to package.json', async () => {
    await configurationGenerator(host, options);

    const packageJson = readJson(host, 'package.json');
    expect(packageJson.dependencies['@ionic/react']).toBeDefined();
    expect(packageJson.dependencies['@ionic/react-router']).toBeDefined();
  });

  it('should generate application', async () => {
    await configurationGenerator(host, options);

    testGeneratedFiles(host, { ...options });
  });

  it('should delete unused @nx/react files', async () => {
    await configurationGenerator(host, options);

    expect(host.exists(`${projectRoot}/src/app/app.css`)).toBeFalsy();
    expect(host.exists(`${projectRoot}/public/favicon.ico`)).toBeFalsy();
    expect(host.exists(`${projectRoot}/src/favicon.ico`)).toBeFalsy();
  });

  it('should update assets in project configuration', async () => {
    await configurationGenerator(host, options);
    const project = readProjectConfiguration(host, options.project);

    expect(project.targets.build.options.assets).not.toContain(
      `${projectRoot}/src/favicon.ico`
    );
    expect(project.targets.build.options.assets).toContain(
      `${projectRoot}/src/manifest.json`
    );
  });

  describe('--capacitor', () => {
    describe('true', () => {
      it('should generate Capacitor project', async () => {
        await configurationGenerator(host, { ...options, capacitor: true });

        testGeneratedFiles(host, { ...options, capacitor: true });
      });
    });
  });

  describe('TS-solution mode', () => {
    let tsSolutionTree: Tree;
    const tsProjectRoot = `packages/${options.project}`;

    beforeEach(() => {
      tsSolutionTree = createTsSolutionTree();
      // `@nx/angular`'s `application` generator (used above purely as a
      // lightweight app-scaffolding harness - ionic-react itself has no
      // dependency on Angular) still calls `assertNotUsingTsSolutionSetup`
      // itself and cannot run against a TS-solution tree, so the
      // pre-existing project is fabricated directly here instead, mirroring
      // how an app/lib generator would register a project in a TS-solution
      // workspace by default (package.json + `nx` field, no project.json -
      // see e.g. @nx/web's `addProject`).
      writeJson(tsSolutionTree, `${tsProjectRoot}/package.json`, {
        name: options.project,
        version: '0.0.1',
        nx: {
          targets: {
            build: {
              executor: '@nx/vite:build',
              options: {
                outputPath: `dist/${tsProjectRoot}`,
                assets: [],
                styles: [],
              },
            },
          },
        },
      });
    });

    it('configures Ionic React for a package.json-based (TS-solution) project without crashing', async () => {
      await configurationGenerator(tsSolutionTree, options);

      expect(
        tsSolutionTree.exists(`${tsProjectRoot}/src/App.tsx`)
      ).toBeTruthy();
      expect(
        tsSolutionTree.exists(`${tsProjectRoot}/ionic.config.json`)
      ).toBeTruthy();

      // updateWorkspace patches targets via updateProjectConfiguration,
      // which - for a package.json-based project - writes back into
      // `package.json`'s `nx` field (Nx core dispatches on which of
      // project.json/package.json exists; see
      // `nx/src/generators/utils/project-configuration.js`).
      const project = readProjectConfiguration(
        tsSolutionTree,
        options.project
      );
      expect(project.targets.build.options.assets).toContain(
        `${tsProjectRoot}/src/manifest.json`
      );
    });

    it('also configures Capacitor transitively when --capacitor is set', async () => {
      await configurationGenerator(tsSolutionTree, {
        ...options,
        capacitor: true,
      });

      expect(
        tsSolutionTree.exists(`${tsProjectRoot}/capacitor.config.ts`)
      ).toBeTruthy();
    });
  });
});
