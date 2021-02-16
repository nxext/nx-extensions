import { NormalizedSchema } from '../schema';
import { Rule } from '@angular-devkit/schematics';
import { ProjectType, updateWorkspace } from '@nrwl/workspace';
import { getSystemPath, join, normalize } from '@angular-devkit/core';

export function addProject(options: NormalizedSchema): Rule {
  return updateWorkspace((workspace) => {
    const targetCollection = workspace.projects.add({
      name: options.projectName,
      root: options.projectRoot,
      sourceRoot: `${options.projectRoot}/src`,
      projectType: ProjectType.Library
    }).targets;

    targetCollection.add(getLintOptions(options));

    if (options.buildable) {
      targetCollection.add(getBuildOptions(options));
    }

    if (options.unitTestRunner === 'jest') {
      targetCollection.add(getJestOptions(options));
    }
  });
}


function getLintOptions(options: NormalizedSchema) {
  return {
    name: 'lint',
    builder: '@nrwl/linter:lint',
    options: {
      linter: 'eslint',
      tsConfig: getSystemPath(join(normalize(options.projectRoot), 'tsconfig.lib.json')),
      exclude: [
        '**/node_modules/**',
        `!${getSystemPath(join(normalize(options.projectRoot), '**/*'))}`,
      ],
    },
  };
}


function getBuildOptions(options: NormalizedSchema) {
  return {
    name: 'build',
    builder: '@nxext/svelte:build',
    options: {
      ...{
        outputPath: getSystemPath(join(normalize('dist'), options.projectRoot)),
        entryFile: getSystemPath(join(normalize(options.projectRoot), 'src/index.ts')),
        tsConfig: getSystemPath(join(normalize(options.projectRoot), 'tsconfig.lib.json')),
        assets: [],
      }
    },
    configurations: {
      production: {
        ...{
          dev: false,
        }
      },
    },
  };
}

function getJestOptions(options: NormalizedSchema) {
  return {
    name: 'test',
    builder: '@nrwl/jest:jest',
    options: {
      jestConfig: getSystemPath(join(normalize(options.projectRoot), 'jest.config.js')),
      passWithNoTests: true,
    },
  };
}
