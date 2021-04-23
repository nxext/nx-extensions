import {
  applyTemplates,
  chain,
  move,
  Rule,
  SchematicContext,
  Tree,
  url,
} from '@angular-devkit/schematics';
import {
  addDepsToPackageJson,
  formatFiles,
  getProjectConfig,
  insert,
} from '@nrwl/workspace';
import { applyWithSkipExisting } from '../../utils/utils';
import * as ts from 'typescript';
import { Change, insertImport } from '@nrwl/workspace/src/utils/ast-utils';
import { readTsSourceFileFromTree } from '../../utils/ast-utils';
import { addCodeIntoArray } from '../../utils/utils';
import { stripIndents } from '@angular-devkit/core/src/utils/literals';
import { wrapAngularDevkitSchematic } from '@nrwl/devkit/ngcli-adapter';
import { logger } from '@nrwl/devkit';

export interface Schema {
  project: string;
  skipFormat: boolean;
}

export function addToPlugins(
  source: ts.SourceFile,
  file: string,
  toInsert: string
): Change[] {
  const pluginsIdentifier = 'plugins';
  return addCodeIntoArray(source, pluginsIdentifier, toInsert, file);
}

function createTailwindConfigForProject(options: Schema): Rule {
  return (tree: Tree, context: SchematicContext) => {
    const projectConfig = getProjectConfig(tree, options.project);
    const sourceRoot = projectConfig.sourceRoot;
    const projectRoot = projectConfig.root;

    return chain([
      applyWithSkipExisting(url('./files'), [
        applyTemplates({
          sourceRoot,
        }),
        move(projectRoot),
      ]),
    ])(tree, context);
  };
}

export function addStylePluginToConfigInTree(options: Schema): Rule {
  return (tree: Tree) => {
    const projectConfig = getProjectConfig(tree, options.project);
    const projectRoot = projectConfig.root;
    const stencilConfigPath =
      projectConfig?.targets?.build?.options?.configPath ||
      projectConfig?.targets?.test?.options?.configPath;
    const stencilConfigSource: ts.SourceFile = readTsSourceFileFromTree(
      tree,
      stencilConfigPath
    );

    insert(tree, stencilConfigPath, [
      insertImport(
        stencilConfigSource,
        stencilConfigPath,
        'postcss',
        '@stencil/postcss'
      ),
      insertImport(
        stencilConfigSource,
        stencilConfigPath,
        'autoprefixer',
        'autoprefixer',
        true
      ),
      insertImport(
        stencilConfigSource,
        stencilConfigPath,
        'cssnano',
        'cssnano',
        true
      ),
      insertImport(
        stencilConfigSource,
        stencilConfigPath,
        'tailwindcss',
        'tailwindcss',
        true
      ),
      ...addToPlugins(
        stencilConfigSource,
        stencilConfigPath,
        `
          postcss({
            plugins: [
              tailwindcss('./${projectRoot}/tailwind.config.js'),
              autoprefixer(),
              cssnano()
            ]
          })
          `
      ),
    ]);

    return tree;
  };
}

export function tailwindStencilSchematic(options: Schema): Rule {
  return chain([
    addDepsToPackageJson(
      {},
      {
        '@stencil/postcss': '^2.0.0',
        tailwindcss: 'npm:@tailwindcss/postcss7-compat',
        autoprefixer: '^9.0.0',
        cssnano: '^4.1.10',
      }
    ),
    createTailwindConfigForProject(options),
    addStylePluginToConfigInTree(options),
    (tree: Tree, context: SchematicContext) => {
      logger.info(stripIndents`
          To use Tailwindcss, import the modules you need into your app.css (or scss, less, styl or whatever your global file extension is).

          Import e.g.:
          @tailwind base;
          @tailwind components;
          @tailwind utilities;

          More informations about tailwindcss and tailwind imports: https://tailwindcss.com/docs/installation#include-tailwind-in-your-css
      `);
    },
    formatFiles({ skipFormat: options.skipFormat }),
  ]);
}

export default tailwindStencilSchematic;
export const tailwindStencilGenerator = wrapAngularDevkitSchematic(
  '@nxext/tailwind',
  'stencil'
);
