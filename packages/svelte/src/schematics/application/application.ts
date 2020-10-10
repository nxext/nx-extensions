import {
  apply,
  applyTemplates,
  chain,
  mergeWith,
  move,
  Rule,
  url,
  SchematicContext,
  Tree,
} from '@angular-devkit/schematics';
import {
  addLintFiles,
  addProjectToNxJsonInTree, formatFiles,
  names,
  offsetFromRoot,
  projectRootDir,
  ProjectType,
  toFileName,
  updateWorkspace
} from '@nrwl/workspace';
import { NormalizedSchema, SvelteSchematicSchema } from './schema';
import { join, normalize } from '@angular-devkit/core';
import { extraEslintDependencies, svelteEslintJson } from '../utils/lint';
import init from '../init/init';

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
    skipFormat: false
  };
}

function addProject(options: NormalizedSchema): Rule {
  return updateWorkspace((workspace) => {
    const targetCollection = workspace.projects.add({
      name: options.projectName,
      root: options.projectRoot,
      sourceRoot: `${options.projectRoot}/src`,
      projectType
    }).targets;

    targetCollection.add({
      name: 'build',
      builder: '@nxext/svelte:build',
      options: {
        outputPath: join(normalize('dist'), options.projectRoot),
        entryFile: join(
          normalize(options.projectRoot),
          'src/main.ts'
        ),
        tsConfig: join(
          normalize(options.projectRoot),
          'tsconfig.app.json'
        ),
        assets: [join(normalize(options.projectRoot), 'public')]
      }
    });
    targetCollection.add({
      name: 'serve',
      builder: '@nxext/svelte:build',
      options: {
        outputPath: join(normalize('dist'), options.projectRoot),
        entryFile: join(
          normalize(options.projectRoot),
          'src/main.ts'
        ),
        tsConfig: join(
          normalize(options.projectRoot),
          'tsconfig.app.json'
        ),
        assets: [join(normalize(options.projectRoot), 'public')],
        watch: true,
        serve: true
      }
    });
    targetCollection.add({
      name: 'lint',
      builder: '@nrwl/linter:lint',
      options: {
        linter: 'eslint',
        tsConfig: join(
          normalize(options.projectRoot),
          'tsconfig.app.json'
        ),
        exclude: [
          '**/node_modules/**',
          `!${join(normalize(options.projectRoot), '**/*')}`
        ]
      }
    });

    if(options.unitTestRunner === 'jest') {
      targetCollection.add({
        name: 'test',
        builder: '@nrwl/jest:jest',
        options: {
          jestConfig: join(normalize(options.projectRoot), 'jest.config.js'),
          passWithNoTests: true
        }
      });
    }
  });
}

function addFiles(options: NormalizedSchema): Rule {
  return mergeWith(
    apply(url(`./files`), [
      applyTemplates({
        ...options,
        ...names(options.name),
        offsetFromRoot: offsetFromRoot(options.projectRoot),
        projectRoot: options.projectRoot
      }),
      move(options.projectRoot)
    ])
  );
}

function handleJest(options: NormalizedSchema) {
  return (tree: Tree) => {
    if(options.unitTestRunner !== 'jest') {
      tree.delete(`${options.projectRoot}/jest.config.js`);
      tree.delete(`${options.projectRoot}/tsconfig.spec.json`);
    }
  }
}

export default function(options: SvelteSchematicSchema): Rule {
  const normalizedOptions = normalizeOptions(options);
  return chain([
    init({ ...normalizedOptions, skipFormat: true }),
    addProject(normalizedOptions),
    addProjectToNxJsonInTree(normalizedOptions.projectName, {
      tags: normalizedOptions.parsedTags
    }),
    addFiles(normalizedOptions),
    addLintFiles(normalizedOptions.projectRoot, options.linter, {
      localConfig: svelteEslintJson,
      extraPackageDeps: extraEslintDependencies
    }),
    handleJest(normalizedOptions),
    formatFiles(normalizedOptions)
  ]);
}
