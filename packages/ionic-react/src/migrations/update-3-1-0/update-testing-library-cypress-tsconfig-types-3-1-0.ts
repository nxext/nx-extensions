/* eslint-disable @typescript-eslint/no-explicit-any */
import { chain, Rule, Tree } from '@angular-devkit/schematics';
import { formatFiles, readJsonInTree, updateJsonInTree } from '@nrwl/workspace';
import * as path from 'path';

function getTsconfigFilePaths(host: Tree): {
  tsconfigFilePaths: string[];
  tsconfigE2eFilePaths: string[];
} {
  const tsconfigFilePaths = [];
  const tsconfigE2eFilePaths = [];

  const workspaceJson = readJsonInTree(host, 'workspace.json');
  Object.values<any>(workspaceJson.projects).forEach((project) => {
    Object.values<any>(project.architect).forEach((target) => {
      if (
        target.options?.webpackConfig !== '@nxext/ionic-react/plugins/webpack'
      ) {
        return;
      }

      const e2eProjectName = Object.keys(workspaceJson.projects).find(
        (key) => workspaceJson.projects[key] === project
      );

      const e2eProject = workspaceJson.projects[`${e2eProjectName}-e2e`];

      if (
        host.exists(`${e2eProject.root}/tsconfig.e2e.json`) &&
        host.exists(`${e2eProject.root}/tsconfig.json`)
      ) {
        tsconfigFilePaths.push(path.join(e2eProject.root, 'tsconfig.json'));
        tsconfigE2eFilePaths.push(`${e2eProject.root}/tsconfig.e2e.json`);
      }
    });
  });

  return { tsconfigFilePaths, tsconfigE2eFilePaths };
}

function updateTsconfigFilePaths(tsconfigFilePaths: string[]): Rule[] {
  const rules: Rule[] = [];

  tsconfigFilePaths.forEach((tsconfigFilePath) => {
    rules.push(
      updateJsonInTree(tsconfigFilePath, (json) => {
        if (json.compilerOptions?.types) {
          const index = json.compilerOptions.types.indexOf(
            '@types/testing-library__cypress'
          );

          if (index !== -1) {
            json.compilerOptions.types.splice(index, 1);
          }
        }

        return json;
      })
    );
  });

  return rules;
}

function updateTsconfigE2eFilePaths(tsconfigE2eFilePaths: string[]): Rule[] {
  const rules: Rule[] = [];

  tsconfigE2eFilePaths.forEach((tsconfigFilePath) => {
    rules.push(
      updateJsonInTree(tsconfigFilePath, (json) => {
        if (!json.compilerOptions) {
          json.compilerOptions = {};
        }

        if (!json.compilerOptions.types) {
          json.compilerOptions.types = [];
        }

        json.compilerOptions.types.push('@testing-library/cypress');

        return json;
      })
    );
  });

  return rules;
}

function updateCypressTsconfigTypes(): Rule {
  return (host: Tree) => {
    let rules: Rule[] = [];
    const { devDependencies } = readJsonInTree(host, 'package.json');

    if (devDependencies && devDependencies['@nxext/ionic-react']) {
      const { tsconfigFilePaths, tsconfigE2eFilePaths } =
        getTsconfigFilePaths(host);

      rules = updateTsconfigFilePaths(tsconfigFilePaths);
      rules = [...rules, ...updateTsconfigE2eFilePaths(tsconfigE2eFilePaths)];
    }

    return chain(rules);
  };
}

export default function update(): Rule {
  return chain([updateCypressTsconfigTypes(), formatFiles()]);
}
