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
  getNpmScope,
  getWorkspacePath,
  ProjectType,
  updateJsonInTree
} from '@nrwl/workspace';
import { names, offsetFromRoot } from '@nrwl/devkit';
import { RawLibrarySchema, LibrarySchema } from './schema';
import { AppType } from '../../utils/typings';
import { calculateStyle } from '../../utils/utils';
import { libsDir } from '@nrwl/workspace/src/utils/ast-utils';
import { initSchematic } from '../../generators/init/init';
import { MakeLibBuildableSchema } from '../make-lib-buildable/schema';
import { updateTsConfig } from './lib/update-tsconfig';
import { wrapAngularDevkitSchematic } from '@nrwl/devkit/ngcli-adapter';
import { getTestBuilder } from '../../utils/builders';

const projectType = ProjectType.Library;

function normalizeOptions(options: RawLibrarySchema, host: Tree): LibrarySchema {
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
  const importPath = options.importPath || `@${getNpmScope(host)}/${projectDirectory}`;

  return {
    ...options,
    projectName,
    projectRoot,
    projectDirectory,
    parsedTags,
    style,
    appType,
    importPath
  } as LibrarySchema;
}

function addFiles(options: LibrarySchema): Rule {
  return mergeWith(
    apply(url(`./files/lib`), [
      applyTemplates({
        ...options,
        ...names(options.name),
        offsetFromRoot: offsetFromRoot(options.projectRoot)
      }),
      move(options.projectRoot),
      formatFiles({ skipFormat: options.skipFormat })
    ])
  );
}

export function librarySchematic(options: RawLibrarySchema): Rule {
  return (host: Tree) => {
    const normalizedOptions = normalizeOptions(options, host);
    if (options.publishable === true && !options.importPath) {
      throw new Error(
        `For publishable libs you have to provide a proper "--importPath" which needs to be a valid npm package name (e.g. my-awesome-lib or @myorg/my-lib)`
      );
    }
    return chain([
      initSchematic(normalizedOptions),
      updateJsonInTree(getWorkspacePath(host),(json) => {
        const targets = {};
        targets['test'] = getTestBuilder(projectType, normalizedOptions);
        json.projects[normalizedOptions.projectName] = {
          root: normalizedOptions.projectRoot,
          sourceRoot: `${normalizedOptions.projectRoot}/src`,
          projectType,
          targets,
          generators: {
            '@nxext/stencil:component': {
              style: options.style,
              storybook: false
            }
          }
        };

        return json;
      }),
      addProjectToNxJsonInTree(normalizedOptions.projectName, {
        tags: normalizedOptions.parsedTags
      }),
      addFiles(normalizedOptions),
      updateTsConfig(normalizedOptions),
      normalizedOptions.buildable || normalizedOptions.publishable
        ? schematic('make-lib-buildable', {
          name: normalizedOptions.projectName,
          importPath: normalizedOptions.importPath,
          style: normalizedOptions.style
        } as MakeLibBuildableSchema)
        : noop(),
    ]);
  };
}
export default librarySchematic;
export const libraryGenerator = wrapAngularDevkitSchematic(
  '@nxext/stencil',
  'library'
);
