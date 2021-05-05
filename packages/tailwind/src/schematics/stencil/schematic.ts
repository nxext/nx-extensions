import {
  addDependenciesToPackageJson,
  convertNxGenerator,
  formatFiles, generateFiles, joinPathFragments,
  logger, readProjectConfiguration,
  stripIndents,
  Tree
} from '@nrwl/devkit';
import { addStylePluginToConfigInTree } from './lib/ast-utils';

export interface Schema {
  project: string;
  skipFormat: boolean;
}

export function createTailwindConfigForProject(tree: Tree, options: Schema) {
  const projectConfig = readProjectConfiguration(tree, options.project);
  const sourceRoot = projectConfig.sourceRoot;
  const projectRoot = projectConfig.root;

  generateFiles(tree, joinPathFragments(__dirname, './files'), projectRoot, {
    sourceRoot,
    projectRoot
  });
}


async function tailwindStencilGenerator(tree: Tree, options: Schema) {
  createTailwindConfigForProject(tree, options);
  addStylePluginToConfigInTree(tree, options);

  if (!options.skipFormat) {
    await formatFiles(tree);
  }

  logger.info(stripIndents`
    To use Tailwindcss, import the modules you need into your app.css (or scss, less, styl or whatever your global file extension is).

    Import e.g.:
    @tailwind base;
    @tailwind components;
    @tailwind utilities;

    More informations about tailwindcss and tailwind imports: https://tailwindcss.com/docs/installation#include-tailwind-in-your-css
  `);

  return addDependenciesToPackageJson(
    tree,
    {},
    {
      '@stencil/postcss': '^2.0.0',
      tailwindcss: 'npm:@tailwindcss/postcss7-compat',
      autoprefixer: '^9.0.0',
      cssnano: '^4.1.10'
    }
  );
}

export default tailwindStencilGenerator;
export const tailwindStencilSchematic = convertNxGenerator(tailwindStencilGenerator);
