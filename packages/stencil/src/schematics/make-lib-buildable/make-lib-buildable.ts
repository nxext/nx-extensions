import { apply, applyTemplates, chain, mergeWith, move, Rule, Tree, url } from '@angular-devkit/schematics';
import { formatFiles, getWorkspacePath, ProjectType, updateJsonInTree } from '@nrwl/workspace';
import { offsetFromRoot } from '@nrwl/devkit';
import { getProjectConfig } from '@nrwl/workspace/src/utils/ast-utils';
import { MakeLibBuildableSchema } from './schema';
import { join } from 'path';
import { addStylePluginToConfigInTree, addToOutputTargetsInTree } from '../../stencil-core-utils';
import { wrapAngularDevkitSchematic } from '@nrwl/devkit/ngcli-adapter';
import { getBuildBuilder, getE2eBuilder, getServeBuilder } from '../../utils/builders';

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
        ...options
      }),
      move(options.projectRoot),
    ])
  );
}

export function makeLibBuildableSchematic(schema: MakeLibBuildableSchema): Rule {
  return (tree: Tree) => {
    const stencilProjectConfig = getProjectConfig(tree, schema.name);
    const options = normalize(schema, stencilProjectConfig);

    return chain([
      updateJsonInTree(getWorkspacePath(tree),(json) => {
        const project = json.projects[schema.name];
        const targets = {};
        targets['build'] = getBuildBuilder(projectType, options);
        targets['serve'] = getServeBuilder(projectType, options);
        targets['e2e'] = getE2eBuilder(projectType, options);
        project.targets = targets;

        return json;
      }),
      addFiles(options),
      addStylePluginToConfigInTree(
        join(options.projectRoot, 'stencil.config.ts'),
        options.style
      ),
      addToOutputTargetsInTree(
        [
          `{
          type: 'dist',
          esmLoaderPath: '../loader',
          dir: '${offsetFromRoot(options.projectRoot)}dist/${
            options.projectRoot
          }/dist',
        }`
        ],
        join(options.projectRoot, 'stencil.config.ts')
      ),
      formatFiles(),
    ]);
  };
}

export default makeLibBuildableSchematic;
export const makeLibBuildableGenerator = wrapAngularDevkitSchematic(
  '@nxext/stencil',
  'make-lib-buildable'
);
