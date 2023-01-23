import {
  convertNxGenerator,
  formatFiles,
  generateFiles,
  names,
  readProjectConfiguration,
  GeneratorCallback,
  Tree, getProjects, applyChangesToString
} from '@nrwl/devkit';
import * as path from 'path';
import { Schema } from './schema';
import { runTasksInSerial } from '@nrwl/workspace/src/utilities/run-tasks-in-serial';
import { joinPathFragments } from 'nx/src/utils/path';
import { addImport } from '@nrwl/react/src/utils/ast-utils';
import * as ts from 'typescript';

interface NormalizedSchema extends Schema {
  projectRoot: string;
  projectSourceRoot: string;
  fileName: string;
}
function normalizeOptions(tree: Tree, options: Schema): NormalizedSchema {
  const project = readProjectConfiguration(tree, options.project);
  const projectRoot = project.root;
  const fileName = names(options.name).className;
  const projectSourceRoot = project.sourceRoot;
  const directory = options.directory ? `components/${options.directory}` : `components`;

  return {
    ...options,
    projectRoot,
    fileName,
    directory,
    projectSourceRoot
  };
}

function createComponentFiles(tree: Tree, options: NormalizedSchema) {
  const templateOptions = {
    ...options,
    ...names(options.name),
    template: '',
  };
  generateFiles(
    tree,
    path.join(__dirname, './files'),
    options.projectRoot,
    templateOptions
  );
}

export async function componentGenerator(tree: Tree, schema: Schema) {
  const tasks: GeneratorCallback[] = [];

  const options = normalizeOptions(tree, schema);
  createComponentFiles(tree, options);
  await formatFiles(tree);

  addExportsToBarrel(tree, options);

  return runTasksInSerial(...tasks);
}


function addExportsToBarrel(host: Tree, options: NormalizedSchema) {
  const workspace = getProjects(host);
  const isApp = workspace.get(options.project).projectType === 'application';

  if (options.export && !isApp) {
    const indexFilePath = joinPathFragments(
      options.projectSourceRoot, 'index.ts'
    );
    const indexSource = host.read(indexFilePath, 'utf-8');
    if (indexSource !== null) {
      const indexSourceFile = ts.createSourceFile(
        indexFilePath,
        indexSource,
        ts.ScriptTarget.Latest,
        true
      );
      const changes = applyChangesToString(
        indexSource,
        addImport(
          indexSourceFile,
          `export * from './${options.directory}/${options.fileName}.vue';`
        )
      );
      host.write(indexFilePath, changes);
    }
  }
}


export default componentGenerator;

export const componentSchematic = convertNxGenerator(componentGenerator);
