import {
  apply,
  applyTemplates,
  chain,
  mergeWith,
  move,
  Rule,
  Tree,
  url,
} from '@angular-devkit/schematics';
import {
  formatFiles,
  ProjectType,
  readNxJson,
  updateWorkspace,
} from '@nrwl/workspace';
import { names, offsetFromRoot } from '@nrwl/devkit';
import { getProjectConfig } from '@nrwl/workspace/src/utils/ast-utils';
import { addBuilderToTarget } from '../../utils/utils';
import { MakeLibBuildableSchema } from './schema';
import { join } from 'path';
import {
  addStylePluginToConfigInTree,
  addToOutputTargetsInTree,
} from '../../stencil-core-utils';
import { wrapAngularDevkitSchematic } from '@nrwl/devkit/ngcli-adapter';

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
  const nxJson = readNxJson();
  const projectNames = names(options.name);
  return mergeWith(
    apply(url(`./files/lib`), [
      applyTemplates({
        ...options,
        ...projectNames,
        offsetFromRoot: offsetFromRoot(options.projectRoot),
        pkgJsonName: `@${nxJson.npmScope}/${projectNames.fileName}`,
      }),
      move(options.projectRoot),
    ])
  );
}

export default function (options: MakeLibBuildableSchema): Rule {
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
            watch: true,
          },
        });
      }),
      addFiles(normalizedOptions),
      addStylePluginToConfigInTree(
        join(normalizedOptions.projectRoot, 'stencil.config.ts'),
        normalizedOptions.style
      ),
      addToOutputTargetsInTree(
        [
          `{
          type: 'dist',
          esmLoaderPath: '../loader',
          dir: '${offsetFromRoot(normalizedOptions.projectRoot)}dist/${
            normalizedOptions.projectRoot
          }/loader',
        }`,
          `{
          type: 'docs-readme'
        }`,
          `{
          type: 'dist-custom-elements-bundle',
        }`,
          `{
          type: 'www',
          dir: '${offsetFromRoot(normalizedOptions.projectRoot)}dist/${
            normalizedOptions.projectRoot
          }/www',
          serviceWorker: null
        }`,
        ],
        join(normalizedOptions.projectRoot, 'stencil.config.ts')
      ),
      formatFiles(),
    ]);
  };
}

export const makeLibBuildableGenerator = wrapAngularDevkitSchematic(
  '@nxext/stencil',
  'make-lib-buildable'
);
