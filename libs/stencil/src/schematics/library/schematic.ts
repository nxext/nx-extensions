import {
  apply,
  applyTemplates,
  chain,
  mergeWith,
  move,
  Rule,
  SchematicContext,
  Tree,
  url,
} from '@angular-devkit/schematics';
import {
  addProjectToNxJsonInTree,
  formatFiles,
  names,
  NxJson,
  offsetFromRoot,
  projectRootDir,
  ProjectType,
  readJsonInTree,
  toFileName,
  updateJsonInTree,
  updateWorkspace,
} from '@nrwl/workspace';
import { LibrarySchema } from './schema';
import core, { addBuilderToTarget } from '../core/core';
import { CoreSchema } from '../core/schema';
import { AppType } from '../../utils/typings';
import { calculateStyle } from '../../utils/utils';
import { readTsSourceFileFromTree } from '../../utils/ast-utils';
import { insert, insertImport } from '@nrwl/workspace/src/utils/ast-utils';
import * as ts from 'typescript';

/**
 * Depending on your needs, you can change this to either `Library` or `Application`
 */
const projectType = ProjectType.Library;

function normalizeOptions(options: CoreSchema): LibrarySchema {
  const name = toFileName(options.name);
  const projectDirectory = options.directory
    ? `${toFileName(options.directory)}/${name}`
    : name;
  const projectName = projectDirectory.replace(new RegExp('/', 'g'), '-');
  const projectRoot = `${projectRootDir(projectType)}/${projectDirectory}`;
  const parsedTags = options.tags
    ? options.tags.split(',').map((s) => s.trim())
    : [];

  const style = calculateStyle(options.style);
  const appType = AppType.Library;

  return {
    ...options,
    projectName,
    projectRoot,
    projectDirectory,
    parsedTags,
    style,
    appType,
  } as LibrarySchema;
}

function addFiles(options: LibrarySchema): Rule {
  return mergeWith(
    apply(url(`./files/lib`), [
      applyTemplates({
        ...options,
        ...names(options.name),
        offsetFromRoot: offsetFromRoot(options.projectRoot),
      }),
      move(options.projectRoot),
      formatFiles({ skipFormat: options.skipFormat }),
    ])
  );
}

function updateTsConfig(options: LibrarySchema): Rule {
  return chain([
    (host: Tree, context: SchematicContext) => {
      const nxJson = readJsonInTree<NxJson>(host, 'nx.json');
      return updateJsonInTree('tsconfig.json', (json) => {
        const c = json.compilerOptions;
        delete c.paths[`@${nxJson.npmScope}/${options.projectDirectory}`];
        c.paths[`@${nxJson.npmScope}/${options.projectDirectory}`] = [
          `libs/${options.projectDirectory}/src/index.ts`,
        ];
        delete c.paths[
          `@${nxJson.npmScope}/${options.projectDirectory}/loader`
        ];
        c.paths[`@${nxJson.npmScope}/${options.projectDirectory}/loader`] = [
          `dist/libs/${options.projectDirectory}/loader`,
        ];
        return json;
      })(host, context);
    },
  ]);
}

function updateStencilConfig(options: LibrarySchema): Rule {
  return (tree, context) => {
    const stencilConfigPath = `libs/${options.projectName}/stencil.config.ts`;
    const stencilConfigSource: ts.SourceFile = readTsSourceFileFromTree(
      tree,
      stencilConfigPath
    );

    const changes = [];
    if (options.style === 'scss') {
      changes.push(
        insertImport(
          stencilConfigSource,
          stencilConfigPath,
          'sass',
          '@stencil/sass'
        )
      );
    }
    if (options.style === 'less') {
      changes.push(
        insertImport(
          stencilConfigSource,
          stencilConfigPath,
          'less',
          '@stencil/less'
        )
      );
    }
    if (options.style === 'postcss') {
      changes.push(
        insertImport(
          stencilConfigSource,
          stencilConfigPath,
          'postcss',
          '@stencil/postcss'
        )
      );
      changes.push(
        insertImport(
          stencilConfigSource,
          stencilConfigPath,
          'autoprefixer',
          'autoprefixer'
        )
      );
    }
    if (options.style === 'styl') {
      changes.push(
        insertImport(
          stencilConfigSource,
          stencilConfigPath,
          'stylus',
          '@stencil/stylus'
        )
      );
    }

    insert(tree, stencilConfigPath, changes);

    return tree;
  };
}

export default function (options: CoreSchema): Rule {
  const normalizedOptions = normalizeOptions(options);
  return chain([
    core(normalizedOptions),
    updateWorkspace((workspace) => {
      const targetCollection = workspace.projects.add({
        name: normalizedOptions.projectName,
        root: normalizedOptions.projectRoot,
        sourceRoot: `${normalizedOptions.projectRoot}/src`,
        projectType,
        schematics: {
          '@nxext/stencil:component': {
            style: options.style,
            storybook: false,
          },
        },
      }).targets;
      addBuilderToTarget(
        targetCollection,
        'build',
        projectType,
        normalizedOptions
      );
      addBuilderToTarget(
        targetCollection,
        'test',
        projectType,
        normalizedOptions
      );
      addBuilderToTarget(
        targetCollection,
        'e2e',
        projectType,
        normalizedOptions
      );
      addBuilderToTarget(
        targetCollection,
        'serve',
        projectType,
        normalizedOptions
      );
    }),
    addProjectToNxJsonInTree(normalizedOptions.projectName, {
      tags: normalizedOptions.parsedTags,
    }),
    addFiles(normalizedOptions),
    updateTsConfig(normalizedOptions),
    updateStencilConfig(normalizedOptions),
  ]);
}
