import {
  convertNxGenerator,
  formatFiles,
  GeneratorCallback,
  joinPathFragments,
  logger,
  readJson,
  readProjectConfiguration,
  Tree,
  updateProjectConfiguration,
  writeJson,
  generateFiles,
  offsetFromRoot, stripIndents
} from '@nrwl/devkit';
import { runTasksInSerial } from '@nrwl/workspace/src/utilities/run-tasks-in-serial';
import { Linter } from '@nrwl/linter';
import { join } from 'path';
import { cypressProjectGenerator } from '@nrwl/storybook';
import { initGenerator } from '@nrwl/storybook/src/generators/init/init';
import { TsConfig } from '@nrwl/storybook/src/utils/utilities';
import { StorybookConfigureSchema } from './schema';
import { updateLintConfig } from './lib/update-lint-config';
import { isBuildableStencilProject } from '../../utils/utillities';

export async function storybookConfigurationGenerator(
  tree: Tree,
  rawSchema: StorybookConfigureSchema
) {
  const tasks: GeneratorCallback[] = [];
  const uiFramework = '@storybook/html';
  const options = normalizeSchema(rawSchema);

  const projectConfig = readProjectConfiguration(tree, options.name);

  if (!isBuildableStencilProject(projectConfig)) {
    logger.info(stripIndents`
      Please use a buildable library for storybook. Storybook needs a generated
      Stencil loader to work (yet). They're working on native Stencil support, but
      it's not ready yet.

      You could make this library buildable with:

      nx generate @nxext/stencil:make-lib-buildable ${options.name}
      or
      ng generate @nxext/stencil:make-lib-buildable ${options.name}
    `);

    return;
  }

  const initTask = await initGenerator(tree, {
    uiFramework: uiFramework
  });
  tasks.push(initTask);

  createRootStorybookDir(tree);
  createProjectStorybookDir(
    tree,
    options.name,
    uiFramework
  );
  configureTsProjectConfig(tree, options);
  configureTsSolutionConfig(tree, options);
  updateLintConfig(tree, options);
  addStorybookTask(tree, options.name, uiFramework);
  if (options.configureCypress) {
    if (projectConfig.projectType !== 'application') {
      const cypressTask = await cypressProjectGenerator(tree, {
        name: options.name,
        js: false,
        linter: options.linter,
        directory: options.cypressDirectory,
        standaloneConfig: options.standaloneConfig
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
    linter: Linter.EsLint
  };
  return {
    ...defaults,
    ...schema
  };
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

export function createProjectStorybookDir(
  tree: Tree,
  projectName: string,
  uiFramework: string
) {
  const { root, projectType } = readProjectConfiguration(tree, projectName);
  const projectDirectory = projectType === 'application' ? 'app' : 'lib';

  if (tree.exists(join(root, '.storybook'))) {
    return;
  }

  const templatePath = join(
    __dirname,
    './project-files'
  );
  const offset = offsetFromRoot(root);

  generateFiles(tree, templatePath, root, {
    tmpl: '',
    dot: '.',
    uiFramework,
    offsetFromRoot: offset,
    projectType: projectDirectory,
    loaderDir: `${offset}../dist/${root}/loader`
  });
}

export function createRootStorybookDir(
  tree: Tree
) {
  if (tree.exists('.storybook')) {
    return;
  }
  const templatePath = join(__dirname, './root-files');
  generateFiles(tree, templatePath, '', { dot: '.' });
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
    '**/*.stories.jsx',
    '**/*.stories.tsx'
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
      path: './.storybook/tsconfig.json'
    }
  ];

  writeJson(tree, tsConfigPath, tsConfigContent);
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
        configFolder: `${projectConfig.root}/.storybook`
      }
    },
    configurations: {
      ci: {
        quiet: true
      }
    }
  };
  projectConfig.targets['build-storybook'] = {
    executor: '@nrwl/storybook:build',
    outputs: ['{options.outputPath}'],
    options: {
      uiFramework,
      outputPath: joinPathFragments('dist/storybook', projectName),
      config: {
        configFolder: `${projectConfig.root}/.storybook`
      }
    },
    configurations: {
      ci: {
        quiet: true
      }
    }
  };

  updateProjectConfiguration(tree, projectName, projectConfig);
}

export default storybookConfigurationGenerator;
export const storybookConfigurationSchematic = convertNxGenerator(
  storybookConfigurationGenerator
);
