import { apply, applyTemplates, chain, mergeWith, move, Rule, Tree, url } from '@angular-devkit/schematics';
import { formatFiles, names, offsetFromRoot, ProjectType, updateWorkspace } from '@nrwl/workspace';
import { getProjectConfig } from '@nrwl/workspace/src/utils/ast-utils';
import { addBuilderToTarget } from '../../utils/utils';
import { MakeLibBuildableSchema } from './schema';
import { join } from 'path';
import { addStylePluginToConfigInTree } from '@nxext/stencil-core-utils';

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
      addStylePluginToConfigInTree(
        join(normalizedOptions.projectRoot, 'stencil.config.ts'),
        normalizedOptions.style
      ),
      formatFiles()
    ]);
  };
}
