import {
  apply,
  applyTemplates,
  chain,
  mergeWith,
  move,
  Rule,
  Tree,
  url
} from '@angular-devkit/schematics';
import {
  formatFiles,
  insert,
  names,
  offsetFromRoot,
  ProjectType,
  updateWorkspace
} from '@nrwl/workspace';
import {
  getProjectConfig,
  insertImport,
  libsDir
} from '@nrwl/workspace/src/utils/ast-utils';
import { addBuilderToTarget } from '../../utils/utils';
import { MakeLibBuildableSchema } from './schema';
import { readTsSourceFileFromTree } from '../../utils/ast-utils';
import * as ts from 'typescript';
import { join } from 'path';
import { addToPlugins } from '../../utils/add-to-outputargets';

const projectType = ProjectType.Library;

interface NormalizedMakeLibBuildableSchema extends MakeLibBuildableSchema {
  projectRoot: string;
}

function normalize(
  options: MakeLibBuildableSchema,
  stencilProjectConfig
): NormalizedMakeLibBuildableSchema {
  return { ...options, projectRoot: stencilProjectConfig.root };
}

function addFiles(options: MakeLibBuildableSchema): Rule {
  return mergeWith(
    apply(url(`./files/lib`), [
      applyTemplates({
        ...options,
        ...names(options.name),
        offsetFromRoot: offsetFromRoot(options.projectRoot)
      }),
      move(options.projectRoot)
    ])
  );
}

function updateStencilConfig(options: MakeLibBuildableSchema): Rule {
  return (tree: Tree) => {
    const stencilConfigPath = join(options.projectRoot, 'stencil.config.ts');
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
      changes.push(
        ...addToPlugins(
          stencilConfigSource,
          stencilConfigPath,
          'sass()'
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
      changes.push(
        ...addToPlugins(
          stencilConfigSource,
          stencilConfigPath,
          'less()'
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
      changes.push(
        ...addToPlugins(
          stencilConfigSource,
          stencilConfigPath,
          `
          postcss({
            plugins: [autoprefixer()]
          })
          `
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
      changes.push(
        ...addToPlugins(
          stencilConfigSource,
          stencilConfigPath,
          'stylus()'
        )
      );
    }

    insert(tree, stencilConfigPath, changes);

    return tree;
  };
}

export default function(options: MakeLibBuildableSchema): Rule {
  return (tree: Tree) => {
    const stencilProjectConfig = getProjectConfig(tree, options.name);
    const normalizedOptions = normalize(options, stencilProjectConfig);

    return chain([
      updateWorkspace((workspace) => {
        const projectConfig = workspace.projects.get(options.name);
        const targetCollection = projectConfig.targets;
        addBuilderToTarget(
          targetCollection,
          'e2e',
          projectType,
          normalizedOptions
        );
        addBuilderToTarget(
          targetCollection,
          'build',
          projectType,
          normalizedOptions
        );
        targetCollection.add({
          name: 'serve',
          builder: `@nxext/stencil:build`,
          options: {
            projectType,
            configPath: `${normalizedOptions.projectRoot}/stencil.config.ts`,
            serve: true,
            watch: true
          }
        });
      }),
      addFiles(normalizedOptions),
      updateStencilConfig(normalizedOptions),
      formatFiles()
    ]);
  };
}
