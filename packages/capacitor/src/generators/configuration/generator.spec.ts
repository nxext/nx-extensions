import {
  addProjectConfiguration,
  normalizePath,
  readJson,
  readProjectConfiguration,
  Tree,
  writeJson,
} from '@nx/devkit';
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
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

  function createProject(standalone = false) {
    const projectRoot = standalone ? '' : `apps/${options.project}`;
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
    return { projectRoot };
  }

  describe('monorepo', () => {
    beforeEach(() => {
      const project = createProject();
      projectRoot = project.projectRoot;
    });

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

    it('should update workspace.json', async () => {
      await generator(appTree, options);
      const projectConfiguration = readProjectConfiguration(
        appTree,
        options.project
      );

      expect(projectConfiguration.targets.cap.executor).toEqual(
        '@nxext/capacitor:cap'
      );
      expect(projectConfiguration.targets.cap.options).toEqual({
        cmd: '--help',
      });

      expect(projectConfiguration.targets.add.executor).toEqual(
        '@nxext/capacitor:cap'
      );
      expect(projectConfiguration.targets.add.options).toEqual({
        cmd: 'add',
      });
      expect(
        projectConfiguration.targets.add.configurations['ios'].cmd
      ).toEqual('add ios');
      expect(
        projectConfiguration.targets.add.configurations['android'].cmd
      ).toEqual('add android');

      expect(projectConfiguration.targets.copy.executor).toEqual(
        '@nxext/capacitor:cap'
      );
      expect(projectConfiguration.targets.copy.options).toEqual({
        cmd: 'copy',
      });
      expect(
        projectConfiguration.targets.copy.configurations['ios'].cmd
      ).toEqual('copy ios');
      expect(
        projectConfiguration.targets.copy.configurations['android'].cmd
      ).toEqual('copy android');

      expect(projectConfiguration.targets.open.executor).toEqual(
        '@nxext/capacitor:cap'
      );
      expect(projectConfiguration.targets.open.options).toEqual({
        cmd: 'open',
      });
      expect(
        projectConfiguration.targets.open.configurations['ios'].cmd
      ).toEqual('open ios');
      expect(
        projectConfiguration.targets.open.configurations['android'].cmd
      ).toEqual('open android');

      expect(projectConfiguration.targets.sync.executor).toEqual(
        '@nxext/capacitor:cap'
      );
      expect(projectConfiguration.targets.sync.options).toEqual({
        cmd: 'sync',
      });
      expect(
        projectConfiguration.targets.sync.configurations['ios'].cmd
      ).toEqual('sync ios');
      expect(
        projectConfiguration.targets.sync.configurations['android'].cmd
      ).toEqual('sync android');

      expect(projectConfiguration.targets.update.executor).toEqual(
        '@nxext/capacitor:cap'
      );
      expect(projectConfiguration.targets.update.options).toEqual({
        cmd: 'update',
      });
      expect(
        projectConfiguration.targets.update.configurations['ios'].cmd
      ).toEqual('update ios');
      expect(
        projectConfiguration.targets.update.configurations['android'].cmd
      ).toEqual('update android');
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
      const project = createProject(true);
      projectRoot = project.projectRoot;
      await generator(appTree, options);
      const packageJson = readJson(appTree, 'package.json');
      expect(packageJson.dependencies['@capacitor/android']).toEqual(capacitorVersion);
      expect(packageJson.dependencies['@capacitor/ios']).toEqual(capacitorVersion);
    });
  });
});
