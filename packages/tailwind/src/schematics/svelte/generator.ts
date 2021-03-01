import {
  addDependenciesToPackageJson,
  convertNxGenerator,
  generateFiles,
  joinPathFragments,
  logger,
  readProjectConfiguration,
  Tree
} from '@nrwl/devkit';

export interface Schema {
  project: string;
}

async function tailwindSvelteGenerator(tree: Tree, options: Schema) {
  const projectConfig = readProjectConfiguration(tree, options.project);
  const sourceRoot = projectConfig.sourceRoot;
  const projectRoot = projectConfig.root;

  generateFiles(
    tree,
    joinPathFragments(__dirname, './files'),
    projectRoot,
    {
      sourceRoot
    }
  );

  addImportToMainFile(tree, sourceRoot);

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

function addImportToMainFile(tree: Tree, sourceRoot: string) {
  const file = tree.read(`${sourceRoot}/App.svelte`);
  logger.info(file.toString('utf-8'));
}

export default tailwindSvelteGenerator;
export const tailwindSvelteSchematic = convertNxGenerator(tailwindSvelteGenerator);
