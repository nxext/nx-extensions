import {
  addProjectConfiguration,
  normalizePath,
  readJson,
  readNxJson,
  readProjectConfiguration,
  Tree,
  writeJson,
} from '@nx/devkit';
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { createTsSolutionTree } from '@nxext/common';
import generator from './generator';
import { CapacitorConfigurationSchema } from './schema';
import { capacitorVersion } from '../../utils/versions';

describe('capacitor-project', () => {
  let appTree: Tree;
  let projectRoot: string;

  const options: CapacitorConfigurationSchema = {
    project: 'capacitor-app',
    appId: 'com.example.capacitorapp',
    appName: 'Capacitor App',
    skipFormat: true,
  };

  function createProject({
    standalone = false,
  }: { standalone?: boolean } = {}) {
    projectRoot = standalone ? '' : `apps/${options.project}`;
    appTree = createTreeWithEmptyWorkspace(
      standalone ? undefined : { layout: 'apps-libs' }
    );
    addProjectConfiguration(appTree, options.project, {
      root: projectRoot,
      targets: {
        test: {
          executor: '@nx/jest:jest',
        },
      },
    });
  }

  describe('monorepo', () => {
    beforeEach(() => createProject());

    it('should add files', async () => {
      await generator(appTree, options);

      expect(appTree.exists(`${projectRoot}/capacitor.config.ts`)).toBeTruthy();
      expect(appTree.exists(`${projectRoot}/package.json`)).toBeTruthy();
      expect(appTree.exists(`${projectRoot}/.gitignore`)).toBeTruthy();
    });

    it('should add Capacitor dependencies', async () => {
      await generator(appTree, options);
      const packageJson = readJson(appTree, 'package.json');
      expect(packageJson.dependencies['@capacitor/app']).toBeDefined();
      expect(packageJson.dependencies['@capacitor/core']).toBeDefined();
      expect(packageJson.dependencies['@capacitor/android']).toBeDefined();
      expect(packageJson.dependencies['@capacitor/ios']).toBeDefined();
    });

    it('should should not replace existing package.json', async () => {
      writeJson(appTree, normalizePath(projectRoot + '/package.json'), {
        name: 'test',
      });
      await generator(appTree, options);

      expect(appTree.exists(`${projectRoot}/package.json`)).toBeTruthy();
      const packageJson = readJson(appTree, `${projectRoot}/package.json`);
      expect(packageJson.name).toEqual('test');
      expect(packageJson.devDependencies['@capacitor/cli']).toBeTruthy();
    });

    it('should update existing .gitignore', async () => {
      appTree.write(`${projectRoot}/.gitignore`, '/dist\n');
      await generator(appTree, options);

      const gitignore = appTree.read(`${projectRoot}/.gitignore`).toString();
      expect(gitignore).toContain('/dist\n/node_modules');
    });

    it('should calculate webDir relative path', async () => {
      await generator(appTree, options);
      const capacitorConfigJson = appTree
        .read(`${projectRoot}/capacitor.config.ts`)
        .toString();

      expect(capacitorConfigJson).toContain(
        `../../dist/apps/${options.project}`
      );
    });

    it('should update nx.json', async () => {
      await generator(appTree, options);
      const nxJson = readNxJson(appTree);
      expect(nxJson.plugins).toContain('@nxext/capacitor/plugin');
    });

    it('should not remove existing target configurations', async () => {
      await generator(appTree, options);
      const projectConfiguration = readProjectConfiguration(
        appTree,
        options.project
      );

      expect(projectConfiguration.targets.test).toBeTruthy();
      expect(projectConfiguration.targets.test.executor).toEqual(
        '@nx/jest:jest'
      );
    });
  });

  describe('standalone', () => {
    it('should add Capacitor platform dependencies for standalone projects', async () => {
      createProject({ standalone: true });
      await generator(appTree, options);
      const packageJson = readJson(appTree, 'package.json');
      expect(packageJson.dependencies['@capacitor/android']).toEqual(
        capacitorVersion
      );
      expect(packageJson.dependencies['@capacitor/ios']).toEqual(
        capacitorVersion
      );
    });
  });

  describe('TS-solution mode', () => {
    let tsSolutionTree: Tree;
    const tsProjectRoot = `packages/${options.project}`;

    beforeEach(() => {
      tsSolutionTree = createTsSolutionTree();
      // App/lib generators register projects in a TS-solution workspace as
      // package.json-based projects by default (no project.json) - see e.g.
      // @nx/web's `addProject`: `useProjectJson` defaults to
      // `!isUsingTsSolutionConfig`. Nx core's `updateProjectConfiguration`/
      // `readProjectConfiguration` (`nx/src/generators/utils/
      // project-configuration.js`) dispatch transparently on whichever of
      // `project.json`/`package.json` exists at the project root, so
      // capacitor's generator - which only ever calls
      // `readProjectConfiguration` - needs no code changes for this mode,
      // only the `assertNotUsingTsSolutionSetup` guard removed.
      writeJson(tsSolutionTree, `${tsProjectRoot}/package.json`, {
        name: options.project,
        version: '0.0.1',
        nx: {
          targets: {
            build: {
              executor: '@nx/vite:build',
              options: { outputPath: `dist/${tsProjectRoot}` },
            },
          },
        },
      });
    });

    it('configures Capacitor for a package.json-based (TS-solution) project without crashing', async () => {
      await generator(tsSolutionTree, options);

      expect(
        tsSolutionTree.exists(`${tsProjectRoot}/capacitor.config.ts`)
      ).toBeTruthy();
      expect(
        tsSolutionTree.exists(`${tsProjectRoot}/.gitignore`)
      ).toBeTruthy();

      // updateProjectPackageJson merges capacitor deps into the project's
      // EXISTING package.json (there is no separate project.json in this
      // mode) - the pre-existing `nx.targets` must survive untouched.
      const packageJson = readJson(
        tsSolutionTree,
        `${tsProjectRoot}/package.json`
      );
      expect(packageJson.nx.targets.build).toBeDefined();
      expect(packageJson.dependencies['@capacitor/android']).toBeDefined();
      expect(packageJson.devDependencies['@capacitor/cli']).toBeDefined();
    });

    it('registers @nxext/capacitor/plugin in nx.json', async () => {
      await generator(tsSolutionTree, options);
      const nxJson = readNxJson(tsSolutionTree);
      expect(nxJson.plugins).toContain('@nxext/capacitor/plugin');
    });
  });
});
