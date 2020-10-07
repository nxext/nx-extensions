import {
  apply,
  applyTemplates,
  chain,
  mergeWith,
  move,
  Rule,
  url,
} from '@angular-devkit/schematics';
import {
  addDepsToPackageJson,
  addProjectToNxJsonInTree,
  names,
  offsetFromRoot,
  projectRootDir,
  ProjectType,
  toFileName,
  updateWorkspace,
} from '@nrwl/workspace';
import { NormalizedSchema, SvelteSchematicSchema } from './schema';
import { join, normalize } from 'path';

const projectType = ProjectType.Application;

function normalizeOptions(options: SvelteSchematicSchema): NormalizedSchema {
  const name = toFileName(options.name);
  const projectName = name.replace(new RegExp('/', 'g'), '-');
  const projectRoot = `${projectRootDir(projectType)}/${name}`;
  const parsedTags = options.tags
    ? options.tags.split(',').map((s) => s.trim())
    : [];

  return {
    ...options,
    projectName,
    projectRoot,
    parsedTags,
  };
}

function addFiles(options: NormalizedSchema): Rule {
  return mergeWith(
    apply(url(`./files`), [
      applyTemplates({
        ...options,
        ...names(options.name),
        offsetFromRoot: offsetFromRoot(options.projectRoot),
      }),
      move(options.projectRoot),
    ])
  );
}

export default function (options: SvelteSchematicSchema): Rule {
  const normalizedOptions = normalizeOptions(options);
  return chain([
    addDepsToPackageJson(
      {},
      {
        'svelte-jester': '^1.1.5',
        svelte: '^3.29.0',
        'svelte-preprocess': '^4.4.2',
      }
    ),
    updateWorkspace((workspace) => {
      const targetCollection = workspace.projects.add({
        name: normalizedOptions.projectName,
        root: normalizedOptions.projectRoot,
        sourceRoot: `${normalizedOptions.projectRoot}/src`,
        projectType,
      }).targets;

      targetCollection.add({
        name: 'build',
        builder: '@nxext/svelte:build',
        options: {
          outputPath: join(normalize('dist'), normalizedOptions.projectRoot),
          entryFile: join(
            normalize(normalizedOptions.projectRoot),
            'src/main.ts'
          ),
          tsConfig: join(
            normalize(normalizedOptions.projectRoot),
            'tsconfig.app.json'
          ),
          assets: [join(normalize(normalizedOptions.projectRoot), 'public')],
        },
      });
      targetCollection.add({
        name: 'serve',
        builder: '@nxext/svelte:build',
        options: {
          outputPath: join(normalize('dist'), normalizedOptions.projectRoot),
          entryFile: join(
            normalize(normalizedOptions.projectRoot),
            'src/main.ts'
          ),
          tsConfig: join(
            normalize(normalizedOptions.projectRoot),
            'tsconfig.app.json'
          ),
          assets: [join(normalize(normalizedOptions.projectRoot), 'public')],
          watch: true,
          serve: true,
        },
      });
      /*targetCollection.add({
        name: 'test',
        builder: '@nrwl/jest:jest',
        options: {
          jestConfig: join(normalize(normalizedOptions.projectRoot), 'jest.config.js'),
          passWithNoTests: true
        }
      });*/
    }),
    addProjectToNxJsonInTree(normalizedOptions.projectName, {
      tags: normalizedOptions.parsedTags,
    }),
    addFiles(normalizedOptions),
  ]);
}
