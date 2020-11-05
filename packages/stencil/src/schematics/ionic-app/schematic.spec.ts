import { Tree } from '@angular-devkit/schematics';
import { createEmptyWorkspace } from '@nrwl/workspace/testing';
import { readJsonInTree } from '@nrwl/workspace';
import { AppType, STYLE_PLUGIN_DEPENDENCIES } from '../../utils/typings';
import { runSchematic, SUPPORTED_STYLE_LIBRARIES } from '../../utils/testing';

describe('schematic:ionic-app', () => {
  let tree: Tree;
  const options = { name: 'test', appTemplate: "Tabs"};

  beforeEach(() => {
    tree = createEmptyWorkspace(Tree.empty());
  });

  // TODO: Fix testsetup, add @nxtend/capacitor before run
  xit('should run successfully', async () => {
    await expect(
      runSchematic('ionic-app', options, tree)
    ).resolves.not.toThrowError();
  });

  xit('should add Stencil/Ionic App dependencies', async () => {
    const result = await runSchematic('ionic-app', options, tree);
    const packageJson = readJsonInTree(result, 'package.json');
    expect(packageJson.devDependencies['@stencil/core']).toBeDefined();
    expect(packageJson.devDependencies['@ionic/core']).toBeDefined();
  });

  xit('should create files', async () => {
    const appName = 'testapp';
    const result = await runSchematic(
      'ionic-app',
      { name: appName, appType: AppType.Application },
      tree
    );

    const fileList = [
      `apps/${appName}/stencil.config.ts`,
      `apps/${appName}/tsconfig.json`,
      `apps/${appName}/src/components/app-home/app-home.e2e.ts`,
      `apps/${appName}/src/components/app-home/app-home.tsx`,
      `apps/${appName}/src/components/app-home/app-home.css`,
      `apps/${appName}/src/components/app-profile/app-profile.e2e.ts`,
      `apps/${appName}/src/components/app-profile/app-profile.tsx`,
      `apps/${appName}/src/components/app-profile/app-profile.spec.ts`,
      `apps/${appName}/src/components/app-profile/app-profile.css`,
      `apps/${appName}/src/components/app-root/app-root.e2e.ts`,
      `apps/${appName}/src/components/app-root/app-root.tsx`,
      `apps/${appName}/src/components/app-root/app-root.css`
    ];
    fileList.forEach(file => expect(result.exists(file)))
  });

  xit('should create files in subdir', async () => {
    const appName = 'testapp';
    const result = await runSchematic(
      'ionic-app',
      { name: appName, appType: AppType.Application, subdir: 'subdir' },
      tree
    );

    const fileList = [
      `apps/subdir/${appName}/stencil.config.ts`,
      `apps/subdir/${appName}/tsconfig.json`,
      `apps/subdir/${appName}/src/components/app-home/app-home.e2e.ts`,
      `apps/subdir/${appName}/src/components/app-home/app-home.tsx`,
      `apps/subdir/${appName}/src/components/app-home/app-home.css`,
      `apps/subdir/${appName}/src/components/app-profile/app-profile.e2e.ts`,
      `apps/subdir/${appName}/src/components/app-profile/app-profile.tsx`,
      `apps/subdir/${appName}/src/components/app-profile/app-profile.spec.ts`,
      `apps/subdir/${appName}/src/components/app-profile/app-profile.css`,
      `apps/subdir/${appName}/src/components/app-root/app-root.e2e.ts`,
      `apps/subdir/${appName}/src/components/app-root/app-root.tsx`,
      `apps/subdir/${appName}/src/components/app-root/app-root.css`
    ];
    fileList.forEach(file => expect(result.exists(file)))
  });

  xit('should add capacitor project', async () => {
    const appName = 'testapp';
    const result = await runSchematic(
      'ionic-app',
      { name: appName, appType: AppType.Application },
      tree
    );

    const fileList = [
      `apps/${appName}/src/components/app-root/app-root.tsx`,
      `apps/${appName}/src/components/app-profile/app-profile.tsx`,
      `apps/${appName}/src/components/app-home/app-home.tsx`,
      `apps/${appName}/src/components/app-tabs/app-tabs.tsx`
    ];
    fileList.forEach(file => expect(result.exists(file)))
  });

  SUPPORTED_STYLE_LIBRARIES.forEach((style) => {
    xit(`should add Stencil ${style} dependencies to ionic-app`, async () => {
      const result = await runSchematic(
        'ionic-app',
        { ...options, style: style },
        tree
      );
      const packageJson = readJsonInTree(result, 'package.json');
      expect(packageJson.devDependencies['@stencil/core']).toBeDefined();

      const styleDependencies = STYLE_PLUGIN_DEPENDENCIES[style];
      for (const devDependenciesKey in styleDependencies.devDependencies) {
        expect(packageJson.devDependencies[devDependenciesKey]).toBeDefined();
      }
    });
  });
});
