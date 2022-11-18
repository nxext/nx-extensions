import {
  convertNxGenerator,
  formatFiles,
  getWorkspaceLayout,
  joinPathFragments,
  names,
  normalizePath,
  Tree,
  generateFiles,
  updateProjectConfiguration,
  readProjectConfiguration,
  offsetFromRoot,
  installPackagesTask,
  StringChange,
  ChangeType,
  applyChangesToString,
  ProjectConfiguration,
} from '@nrwl/devkit';
import { Schema } from './schema';
import { applicationGenerator as nxApplicationGenerator } from '@nrwl/angular/generators';
import { E2eTestRunner } from '@nrwl/angular/src/utils/test-runners';
import { angularInitGenerator } from '../init/init';
import { createSourceFile, ScriptTarget, SourceFile } from 'typescript';

export function addImport(
  source: SourceFile,
  statement: string
): StringChange[] {
  return [
    {
      type: ChangeType.Insert,
      index: 0,
      text: `\n${statement}\n`,
    },
  ];
}

interface AngularProject extends ProjectConfiguration {
  prefix?: string;
}

export async function applicationGenerator(tree: Tree, options: Schema) {
  await angularInitGenerator(tree, {
    linter: options.linter,
    unitTestRunner: options.unitTestRunner,
    skipFormat: true,
    e2eTestRunner: E2eTestRunner.Cypress,
    skipInstall: true,
    style: 'css',
  });

  const appDirectory = options.directory
    ? `${names(options.directory).fileName}/${names(options.name).fileName}`
    : names(options.name).fileName;

  const appProjectName = appDirectory.replace(new RegExp('/', 'g'), '-');

  const { appsDir } = getWorkspaceLayout(tree);
  const appProjectRoot = normalizePath(`${appsDir}/${appDirectory}`);

  await nxApplicationGenerator(tree, {
    ...options,
    e2eTestRunner: E2eTestRunner.None,
    skipFormat: true,
  });

  tree.delete(joinPathFragments(appProjectRoot, 'tsconfig.app.json'));
  tree.delete(joinPathFragments(appProjectRoot, 'tsconfig.spec.json'));
  tree.delete(joinPathFragments(appProjectRoot, 'tsconfig.json'));
  tree.delete(joinPathFragments(appProjectRoot, 'src', 'index.html'));

  // Angular 15 remove ployfill not sure if this is still needed. For now we will create it for NG 15
  const polyfillPath = joinPathFragments(appProjectRoot, 'src', 'polyfills.ts');
  let sourceText = '';
  if (tree.exists(polyfillPath)) {
    sourceText = tree.read(polyfillPath, 'utf-8');
  }
  const sourceFile = createSourceFile(
    polyfillPath,
    sourceText,
    ScriptTarget.Latest,
    true
  );

  tree.write(
    polyfillPath,
    applyChangesToString(
      sourceText,
      addImport(sourceFile, `import 'reflect-metadata';`)
    )
  );

  const projectConfig = readProjectConfiguration(
    tree,
    appProjectName
  ) as AngularProject;
  updateProjectConfiguration(tree, appProjectName, {
    ...projectConfig,
    targets: {
      ...projectConfig.targets,
      build: {
        ...projectConfig.targets.build,
        executor: '@nxext/vite:build',
        outputs: ['{options.outputPath}'],
        defaultConfiguration: 'production',
        options: {
          outputPath: joinPathFragments('dist', appProjectRoot),
          baseHref: '/',
          configFile: '@nxext/vite/plugins/vite',
          frameworkConfigFile: '@nxext/angular-vite/src/lib/vite',
        },
      },
      serve: {
        ...projectConfig.targets.serve,
        executor: '@nxext/vite:dev',
        options: {
          outputPath: joinPathFragments('dist', appProjectRoot),
          baseHref: '/',
          configFile: '@nxext/vite/plugins/vite',
          frameworkConfigFile: '@nxext/angular/plugins/vite',
        },
      },
    },
  });

  const templateVariables = {
    ...names(options.name),
    ...options,
    tmpl: '',
    offsetFromRoot: offsetFromRoot(appProjectRoot),
    projectName: appProjectName,
    prefix: options.prefix || projectConfig?.prefix || 'app',
  };

  generateFiles(
    tree,
    joinPathFragments(__dirname, './files'),
    appProjectRoot,
    templateVariables
  );

  await formatFiles(tree);
  return () => {
    installPackagesTask(tree);
  };
}

export default applicationGenerator;
export const applicationSchematic = convertNxGenerator(applicationGenerator);
