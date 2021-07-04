import { ProjectType } from '@nrwl/workspace';
import { STYLE_PLUGIN_DEPENDENCIES } from '../../utils/typings';
import { fileListForAppType } from '../../utils/testing';
import { SupportedStyles } from '../../stencil-core-utils';
import { RawApplicationSchema } from './schema';
import { readJson, readProjectConfiguration, Tree } from '@nrwl/devkit';
import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import { applicationGenerator } from './generator';

describe('schematic:application', () => {
  let tree: Tree;
  const options: RawApplicationSchema = { name: 'test' };

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace();
  });

  it('should add Stencil dependencies', async () => {
    await applicationGenerator(tree, options);

    const packageJson = readJson(tree, 'package.json');
    expect(packageJson.devDependencies['@stencil/core']).toBeDefined();
    expect(packageJson.devDependencies['@ionic/core']).toBeUndefined();
  });

  it('should create files', async () => {
    await applicationGenerator(tree, options);

    const fileList = fileListForAppType(
      options.name,
      SupportedStyles.css,
      ProjectType.Application
    );
    fileList.forEach((file) => expect(tree.exists(file)));
  });

  it('should create files in specified dir', async () => {
    await applicationGenerator(tree, { ...options, directory: 'subdir' });

    const fileList = fileListForAppType(
      options.name,
      SupportedStyles.css,
      ProjectType.Application,
      'subdir'
    );
    fileList.forEach((file) => expect(tree.exists(file)));
  });

  Object.keys(SupportedStyles).forEach((style) => {
    it(`should add Stencil ${style} dependencies to application`, async () => {
      await applicationGenerator(tree, {
        ...options,
        style: SupportedStyles[style],
      });

      const packageJson = readJson(tree, 'package.json');
      expect(packageJson.devDependencies['@stencil/core']).toBeDefined();

      const styleDependencies = STYLE_PLUGIN_DEPENDENCIES[style];
      for (const devDependenciesKey in styleDependencies.devDependencies) {
        expect(packageJson.devDependencies[devDependenciesKey]).toBeDefined();
      }
    });
  });

  Object.keys(SupportedStyles).forEach((style) => {
    it(`should add component config for ${style} to workspace config`, async () => {
      await applicationGenerator(tree, {
        ...options,
        style: SupportedStyles[style],
      });

      const projectConfig = readProjectConfiguration(tree, options.name);
      expect(projectConfig.generators).toEqual({
        '@nxext/stencil:component': {
          style: style,
        },
      });
    });
  });
});
