import {
  apply,
  applyTemplates,
  chain,
  mergeWith,
  move,
  noop,
  Rule,
  schematic,
  Tree,
  url
} from '@angular-devkit/schematics';
import {
  addProjectToNxJsonInTree,
  formatFiles,
  ProjectType,
  updateWorkspace
} from '@nrwl/workspace';
import { names, offsetFromRoot } from '@nrwl/devkit';
import { LibrarySchema } from './schema';
import { AppType } from '../../utils/typings';
import { addBuilderToTarget, calculateStyle } from '../../utils/utils';
import { libsDir } from '@nrwl/workspace/src/utils/ast-utils';
import { InitSchema } from '../init/schema';
import { initSchematic } from '../init/init';
import { MakeLibBuildableSchema } from '../make-lib-buildable/schema';
import { updateTsConfig } from './lib/update-tsconfig';
import { wrapAngularDevkitSchematic } from '@nrwl/devkit/ngcli-adapter';

const projectType = ProjectType.Library;

function normalizeOptions(options: InitSchema, host: Tree): LibrarySchema {
  const name = names(options.name).fileName;
  const projectDirectory = options.directory
    ? `${names(options.directory).fileName}/${name}`
    : name;
  const projectName = projectDirectory.replace(new RegExp('/', 'g'), '-');
  const projectRoot = `${libsDir(host)}/${projectDirectory}`;
  const parsedTags = options.tags
    ? options.tags.split(',').map((s) => s.trim())
    : [];

  const style = calculateStyle(options.style);
  const appType = AppType.library;

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

export default function (options: InitSchema): Rule {
  return (host: Tree) => {
    const normalizedOptions = normalizeOptions(options, host);
    return chain([
      initSchematic(normalizedOptions),
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
          'test',
          projectType,
          normalizedOptions
        );
      }),
      addProjectToNxJsonInTree(normalizedOptions.projectName, {
        tags: normalizedOptions.parsedTags,
      }),
      addFiles(normalizedOptions),
      updateTsConfig(normalizedOptions),
      normalizedOptions.buildable
        ? schematic('make-lib-buildable', {
            name: normalizedOptions.projectName,
            style: normalizedOptions.style,
          } as MakeLibBuildableSchema)
        : noop(),
    ]);
  };
}

export const libraryGenerator = wrapAngularDevkitSchematic(
  '@nxext/stencil',
  'library'
);
