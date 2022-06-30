import {
  addDependenciesToPackageJson,
  convertNxGenerator,
  formatFiles,
  generateFiles,
  GeneratorCallback,
  joinPathFragments,
  logger,
  offsetFromRoot,
  readJson,
  readProjectConfiguration,
  toJS,
  Tree,
  updateJson,
  updateProjectConfiguration,
  writeJson,
} from '@nxext/devkit';
import { runTasksInSerial } from '@nrwl/workspace/src/utilities/run-tasks-in-serial';

import { Linter } from '@nrwl/linter';
import { join } from 'path';

import { TsConfig } from '@nrwl/storybook/src/utils/utilities';
import { StorybookConfigureSchema } from './schema';
import { initGenerator } from '@nrwl/storybook/src/generators/init/init';
import { cypressProjectGenerator } from '@nrwl/storybook';

export async function configurationGenerator(
  tree: Tree,
  rawSchema: StorybookConfigureSchema
) {
  const uiFramework = '@storybook/svelte';
  const schema = normalizeSchema(rawSchema);
  const tasks: GeneratorCallback[] = [];
  const { projectType } = readProjectConfiguration(tree, schema.name);

  const initTask = await initGenerator(tree, {
    uiFramework: uiFramework,
  });
  tasks.push(initTask);
  const installTask = await addDependenciesToPackageJson(
    tree,
    {},
    {
      'svelte-loader': '^3.1.2',
    }
  );
  tasks.push(installTask);

  createRootStorybookDir(tree, schema.js);
  createProjectStorybookDir(tree, schema.name, uiFramework, schema.js);
  configureTsProjectConfig(tree, schema);
  configureTsSolutionConfig(tree, schema);
  updateLintConfig(tree, schema);
  addStorybookTask(tree, schema.name, uiFramework);
  if (schema.configureCypress) {
    if (projectType !== 'application') {
      const cypressTask = await cypressProjectGenerator(tree, {
        name: schema.name,
        js: schema.js,
        linter: schema.linter,
        directory: schema.cypressDirectory,
        standaloneConfig: schema.standaloneConfig,
      });
      tasks.push(cypressTask);
    } else {
      logger.warn('There is already an e2e project setup');
    }
  }

  await formatFiles(tree);

  return runTasksInSerial(...tasks);
}

function normalizeSchema(schema: StorybookConfigureSchema) {
  const defaults = {
    configureCypress: true,
    linter: Linter.TsLint,
    js: false,
  };
  return {
    ...defaults,
    ...schema,
  };
}

function createRootStorybookDir(tree: Tree, js: boolean) {
  if (tree.exists('.storybook')) {
    logger.warn(
      `.storybook folder already exists at root! Skipping generating files in it.`
    );
    return;
  }
  logger.debug(`adding .storybook folder to the root directory`);
  const templatePath = join(__dirname, './root-files');
  generateFiles(tree, templatePath, '', { dot: '.' });

  if (js) {
    toJS(tree);
  }
}

function createProjectStorybookDir(
  tree: Tree,
  projectName: string,
  uiFramework: string,
  js: boolean
) {
  /**
   * Here, same as above
   * Check storybook version
   * and use the correct folder
   * lib-files-5 or lib-files-6
   */

  const { root, projectType } = readProjectConfiguration(tree, projectName);
  const projectDirectory = projectType === 'application' ? 'app' : 'lib';

  const storybookRoot = join(root, '.storybook');

  if (tree.exists(storybookRoot)) {
    logger.warn(
      `.storybook folder already exists for ${projectName}! Skipping generating files in it.`
    );
    return;
  }

  logger.debug(`adding .storybook folder to ${projectDirectory}`);
  const templatePath = join(__dirname, './project-files');

  generateFiles(tree, templatePath, root, {
    tmpl: '',
    dot: '.',
    uiFramework,
    offsetFromRoot: offsetFromRoot(root),
    projectType: projectDirectory,
    useWebpack5:
      uiFramework === '@storybook/angular' ||
      uiFramework === '@storybook/react',
    existsRootWebpackConfig: tree.exists('.storybook/webpack.config.js'),
  });

  if (js) {
    toJS(tree);
  }
}

function getTsConfigPath(
  tree: Tree,
  projectName: string,
  path?: string
): string {
  const { root, projectType } = readProjectConfiguration(tree, projectName);
  return join(
    root,
    path && path.length > 0
      ? path
      : projectType === 'application'
      ? 'tsconfig.app.json'
      : 'tsconfig.lib.json'
  );
}

function configureTsProjectConfig(
  tree: Tree,
  schema: StorybookConfigureSchema
) {
  const { name: projectName } = schema;

  let tsConfigPath: string;
  let tsConfigContent: TsConfig;

  try {
    tsConfigPath = getTsConfigPath(tree, projectName);
    tsConfigContent = readJson<TsConfig>(tree, tsConfigPath);
  } catch {
    /**
     * Custom app configurations
     * may contain a tsconfig.json
     * instead of a tsconfig.app.json.
     */

    tsConfigPath = getTsConfigPath(tree, projectName, 'tsconfig.json');
    tsConfigContent = readJson<TsConfig>(tree, tsConfigPath);
  }

  tsConfigContent.exclude = [
    ...(tsConfigContent.exclude || []),
    '**/*.stories.ts',
    '**/*.stories.js',
  ];

  writeJson(tree, tsConfigPath, tsConfigContent);
}

function configureTsSolutionConfig(
  tree: Tree,
  schema: StorybookConfigureSchema
) {
  const { name: projectName } = schema;

  const { root } = readProjectConfiguration(tree, projectName);
  const tsConfigPath = join(root, 'tsconfig.json');
  const tsConfigContent = readJson<TsConfig>(tree, tsConfigPath);

  tsConfigContent.references = [
    ...(tsConfigContent.references || []),
    {
      path: './.storybook/tsconfig.json',
    },
  ];

  writeJson(tree, tsConfigPath, tsConfigContent);
}

/**
 * When adding storybook we need to inform TSLint or ESLint
 * of the additional tsconfig.json file which will be the only tsconfig
 * which includes *.stories files.
 *
 * For TSLint this is done via the builder config, for ESLint this is
 * done within the .eslintrc.json file.
 */
function updateLintConfig(tree: Tree, schema: StorybookConfigureSchema) {
  const { name: projectName } = schema;

  const { targets, root } = readProjectConfiguration(tree, projectName);
  const tslintTargets = Object.values(targets).filter(
    (target) => target.executor === '@angular-devkit/build-angular:tslint'
  );

  tslintTargets.forEach((target) => {
    target.options.tsConfig = dedupe([
      ...target.options.tsConfig,
      joinPathFragments(root, './.storybook/tsconfig.json'),
    ]);
  });

  if (tree.exists(join(root, '.eslintrc.json'))) {
    updateJson(tree, join(root, '.eslintrc.json'), (json) => {
      if (typeof json.parserOptions?.project === 'string') {
        json.parserOptions.project = [json.parserOptions.project];
      }

      if (Array.isArray(json.parserOptions?.project)) {
        json.parserOptions.project = dedupe([
          ...json.parserOptions.project,
          join(root, '.storybook/tsconfig.json'),
        ]);
      }

      const overrides = json.overrides || [];
      for (const o of overrides) {
        if (typeof o.parserOptions?.project === 'string') {
          o.parserOptions.project = [o.parserOptions.project];
        }
        if (Array.isArray(o.parserOptions?.project)) {
          o.parserOptions.project = dedupe([
            ...o.parserOptions.project,
            join(root, '.storybook/tsconfig.json'),
          ]);
        }
      }

      return json;
    });
  }
}

function dedupe(arr: string[]) {
  return Array.from(new Set(arr));
}

function addStorybookTask(
  tree: Tree,
  projectName: string,
  uiFramework: string
) {
  const projectConfig = readProjectConfiguration(tree, projectName);
  projectConfig.targets['storybook'] = {
    executor: '@nrwl/storybook:storybook',
    options: {
      uiFramework,
      port: 4400,
      config: {
        configFolder: `${projectConfig.root}/.storybook`,
      },
      projectBuildConfig: `${projectName}:build-storybook`,
    },
    configurations: {
      ci: {
        quiet: true,
      },
    },
  };
  projectConfig.targets['build-storybook'] = {
    executor: '@nrwl/storybook:build',
    outputs: ['{options.outputPath}'],
    options: {
      uiFramework,
      outputPath: joinPathFragments('dist/storybook', projectName),
      config: {
        configFolder: `${projectConfig.root}/.storybook`,
      },
      projectBuildConfig: `${projectName}:build-storybook`,
    },
    configurations: {
      ci: {
        quiet: true,
      },
    },
  };

  updateProjectConfiguration(tree, projectName, projectConfig);
}

export default configurationGenerator;
export const configurationSchematic = convertNxGenerator(
  configurationGenerator
);
