import {
  addDependenciesToPackageJson,
  convertNxGenerator,
  generateFiles,
  readProjectConfiguration,
  Tree
} from '@nrwl/devkit';
import { join } from 'path';

export interface Schema {
  project: string;
}

async function tailwindSvelteGenerator(tree: Tree, options: Schema) {
  const projectConfig = readProjectConfiguration(tree, options.project);
  const sourceRoot = projectConfig.sourceRoot;
  const projectRoot = projectConfig.root;

  generateFiles(
    tree,
    join(__dirname, '../files/common'),
    projectRoot,
    {sourceRoot}
  );

  return addDependenciesToPackageJson(
    tree,
    {},
    {
      'tailwindcss': '^2.0.0',
      'postcss-import': '^14.0.0',
      'postcss-nested': '^5.0.0'
    }
  );
}

export const tailwindSvelteSchematic = convertNxGenerator(tailwindSvelteGenerator);
