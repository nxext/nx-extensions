import {
  addDependenciesToPackageJson,
  convertNxGenerator,
  generateFiles,
  joinPathFragments,
  ProjectConfiguration,
  readProjectConfiguration,
  Tree,
} from '@nrwl/devkit';

export interface Schema {
  project: string;
}

export async function tailwindSvelteGenerator(tree: Tree, options: Schema) {
  const projectConfig = readProjectConfiguration(tree, options.project);
  const sourceRoot = projectConfig.sourceRoot;
  const projectRoot = projectConfig.root;

  generateFiles(tree, joinPathFragments(__dirname, './files'), projectRoot, {
    sourceRoot,
    projectRoot,
  });

  addImportToMainFile(tree, sourceRoot);
  addToConfigFile(tree, projectConfig);

  return addDependenciesToPackageJson(
    tree,
    {},
    {
      tailwindcss: '^2.1.1',
      'postcss-import': '^14.0.0',
      'postcss-nested': '^5.0.0',
    }
  );
}

function addToConfigFile(tree: Tree, projectConfig: ProjectConfiguration) {
  const svelteConfigPath = projectConfig.targets?.build?.options?.svelteConfig;
  if (svelteConfigPath) {
    if (tree.exists(svelteConfigPath)) {
      tree.delete(`${projectConfig.root}/update-svelte-preprocess.js`);
      const file = tree.read(svelteConfigPath).toString('utf-8');
      const changedFile = file.replace(
        `preprocess: sveltePreprocess()`,
        `preprocess: sveltePreprocess({\n    postcss: {\n      plugins: [\n        require('postcss-import')(),\n        require('postcss-nested')(), // Remove if you don't wan't to use nested structures.\n        require('tailwindcss')('${projectConfig.root}/tailwind.config.js'),\n      ]\n    }\n  })`
      );
      tree.write(svelteConfigPath, changedFile);
    }
  }
}

function addImportToMainFile(tree: Tree, sourceRoot: string) {
  const appFilePath = `${sourceRoot}/App.svelte`;
  const file = tree.read(appFilePath);
  const changedFile = file
    .toString('utf-8')
    .replace(
      `<script lang="ts">`,
      `<script lang="ts">\n    import './Tailwind.svelte';`
    );
  tree.write(appFilePath, changedFile);
}

export default tailwindSvelteGenerator;
export const tailwindSvelteSchematic = convertNxGenerator(
  tailwindSvelteGenerator
);
