import {
  applyTemplates,
  chain,
  move,
  noop,
  Rule,
  SchematicContext,
  template,
  Tree,
  url,
} from '@angular-devkit/schematics';
import {
  addDepsToPackageJson,
  getProjectConfig,
  offsetFromRoot,
  updateJsonInTree,
  updateWorkspace,
  updateWorkspaceInTree,
} from '@nrwl/workspace';
import {
  applyWithSkipExisting,
  getNxVersionFromWorkspace,
  parseJsonAtPath,
} from '../../../utils/utils';
import { storybookVersion } from '../../../utils/versions';
import { toJS } from '@nrwl/workspace/src/utils/rules/to-js';
import { join, normalize } from '@angular-devkit/core';
import { StorybookConfigureSchema } from '../configuration/schema';

export default function (schema: StorybookConfigureSchema) {
  return chain([
    checkDependenciesInstalled(),
    moveToDevDependencies,
    addCacheableOperation,
    createRootStorybookDir(),
    createLibStorybookDir(schema.name, schema.js),
    configureTsConfig(schema.name),
    addStorybookTask(schema.name),
    changeStorybookComponentOption(schema.name),
  ]);
}

function checkDependenciesInstalled(): Rule {
  return (host: Tree, context: SchematicContext): Rule => {
    const devDependencies = {};
    const dependencies = {};

    // base deps
    devDependencies['@nrwl/storybook'] = getNxVersionFromWorkspace();
    devDependencies['@storybook/addon-knobs'] = storybookVersion;
    devDependencies['@storybook/html'] = storybookVersion;

    return addDepsToPackageJson(dependencies, devDependencies);
  };
}

export const addCacheableOperation = updateJsonInTree('nx.json', (nxJson) => {
  if (
    !nxJson.tasksRunnerOptions ||
    !nxJson.tasksRunnerOptions.default ||
    nxJson.tasksRunnerOptions.default.runner !==
      '@nrwl/workspace/tasks-runners/default'
  ) {
    return nxJson;
  }

  nxJson.tasksRunnerOptions.default.options =
    nxJson.tasksRunnerOptions.default.options || {};

  nxJson.tasksRunnerOptions.default.options.cacheableOperations =
    nxJson.tasksRunnerOptions.default.options.cacheableOperations || [];

  if (
    !nxJson.tasksRunnerOptions.default.options.cacheableOperations.includes(
      'build-storybook'
    )
  ) {
    nxJson.tasksRunnerOptions.default.options.cacheableOperations.push(
      'build-storybook'
    );
  }

  return nxJson;
});

const moveToDevDependencies = updateJsonInTree(
  'package.json',
  (packageJson) => {
    packageJson.dependencies = packageJson.dependencies || {};
    packageJson.devDependencies = packageJson.devDependencies || {};

    if (packageJson.dependencies['@nrwl/storybook']) {
      packageJson.devDependencies['@nrwl/storybook'] =
        packageJson.dependencies['@nrwl/storybook'];
      delete packageJson.dependencies['@nrwl/storybook'];
    }
    return packageJson;
  }
);

function createRootStorybookDir(): Rule {
  return (tree: Tree, context: SchematicContext) => {
    context.logger.debug('adding .storybook folder to lib');

    return chain([applyWithSkipExisting(url('./files/root'), [template({})])])(
      tree,
      context
    );
  };
}

function createLibStorybookDir(projectName: string, js: boolean): Rule {
  return (tree: Tree, context: SchematicContext) => {
    context.logger.debug('adding .storybook folder to lib');
    const projectConfig = getProjectConfig(tree, projectName);

    return chain([
      applyWithSkipExisting(url('./files/lib'), [
        applyTemplates({
          offsetFromRoot: offsetFromRoot(projectConfig.root),
        }),
        move(projectConfig.root),
        js ? toJS() : noop(),
      ]),
    ])(tree, context);
  };
}

function configureTsConfig(projectName: string): Rule {
  return (tree: Tree) => {
    const projectPath = getProjectConfig(tree, projectName).root;
    const tsConfigPath = projectPath + '/tsconfig.json';
    const projectTsConfig = parseJsonAtPath(tree, tsConfigPath);

    let tsConfigContent: any;

    if (projectTsConfig && projectTsConfig.value) {
      tsConfigContent = projectTsConfig.value;
    } else {
      return tree;
    }

    tsConfigContent.exclude = tsConfigContent.exclude || [];

    tsConfigContent.exclude = [
      ...tsConfigContent.exclude,
      '**/*.stories.ts',
      '**/*.stories.js',
    ];

    tree.overwrite(
      tsConfigPath,
      JSON.stringify(tsConfigContent, null, 2) + '\n'
    );
    return tree;
  };
}

function addStorybookTask(projectName: string): Rule {
  return updateWorkspace((workspace) => {
    const projectConfig = workspace.projects.get(projectName);
    projectConfig.targets.set('storybook', {
      builder: '@nrwl/storybook:storybook',
      options: {
        uiFramework: '@storybook/html',
        port: 4400,
        config: {
          configFolder: `${projectConfig.root}/.storybook`,
        },
      },
      configurations: {
        ci: {
          quiet: true,
        },
      },
    });
    projectConfig.targets.set('build-storybook', {
      builder: '@nrwl/storybook:build',
      options: {
        uiFramework: '@storybook/html',
        outputPath: join(
          normalize('dist'),
          normalize('storybook'),
          projectName
        ),
        config: {
          configFolder: `${projectConfig.root}/.storybook`,
        },
      },
      configurations: {
        ci: {
          quiet: true,
        },
      },
    });
  });
}

function changeStorybookComponentOption(projectName: string): Rule {
  return updateWorkspaceInTree((json, context) => {
    const projectConfig = json.projects[projectName];
    const componentOptions =
      projectConfig.schematics['@nxext/stencil:component'];
    json.projects[projectName].schematics['@nxext/stencil:component'] = {
      ...componentOptions,
      storybook: true,
    };

    return json;
  });
}
