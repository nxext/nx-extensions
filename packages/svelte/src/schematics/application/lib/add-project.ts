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
      projectType: ProjectType.Application,
    }).targets;

    targetCollection.add(getBuildOptions(options));
    targetCollection.add(getServeOptions(options));
    targetCollection.add(getLintOptions(options));

    if (options.unitTestRunner === 'jest') {
      targetCollection.add(getJestOptions(options));
    }
  });
}

function getBuildOptions(options: NormalizedSchema) {
  let serverOptions: {
    // Ignore
  };
  if (options.port !== 5000) {
    serverOptions = { port: options.port };
  }
  if (options.host !== 'localhost') {
    serverOptions = {
      ...serverOptions,
      ...{ host: options.host },
    };
  }

  return {
    name: 'build',
    builder: '@nxext/svelte:build',
    options: {
      ...{
        outputPath: getSystemPath(join(normalize('dist'), options.projectRoot)),
        entryFile: getSystemPath(join(normalize(options.projectRoot), 'src/main.ts')),
        tsConfig: getSystemPath(join(normalize(options.projectRoot), 'tsconfig.app.json')),
        assets: [{"glob": "/*", "input": "./public/**", "output": "./"}],
      },
      ...serverOptions,
    },
    configurations: {
      production: {
        ...{
          dev: false,
        },
        ...serverOptions,
      },
    },
  };
}

function getServeOptions(options: NormalizedSchema) {
  return {
    name: 'serve',
    builder: '@nxext/svelte:build',
    options: {
      outputPath: getSystemPath(join(normalize('dist'), options.projectRoot)),
      entryFile: getSystemPath(join(normalize(options.projectRoot), 'src/main.ts')),
      tsConfig: getSystemPath(join(normalize(options.projectRoot), 'tsconfig.app.json')),
      assets: [{"glob": "/*", "input": "./public/**", "output": "./"}],
      watch: true,
      serve: true,
    },
    configurations: {
      production: {
        prod: true,
      },
    },
  };
}

function getLintOptions(options: NormalizedSchema) {
  return {
    name: 'lint',
    builder: '@nrwl/linter:lint',
    options: {
      linter: 'eslint',
      tsConfig: getSystemPath(join(normalize(options.projectRoot), 'tsconfig.app.json')),
      exclude: [
        '**/node_modules/**',
        `!${getSystemPath(join(normalize(options.projectRoot), '**/*'))}`,
      ],
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
