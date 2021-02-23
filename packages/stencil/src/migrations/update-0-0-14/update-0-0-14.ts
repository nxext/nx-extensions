import { chain, Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import { formatFiles, updateWorkspaceInTree } from '@nrwl/workspace';
import { stripIndents } from '@angular-devkit/core/src/utils/literals';
import { isStencilProjectBuilder } from '../utils/migration-utils';
import { logger } from '@nrwl/devkit';

function displayInformation() {
  logger.info(stripIndents`
    The configPath is mandatory now. If your configPath doesn't match <projectRoot>/stencil.config.ts please update
    your project builder in workspace.json/angular.json accordingly!
  `);
}

function isConfigPathSet(project, builder: string) {
  return typeof project.architect[builder].options.configPath == 'string';
}

function updateBuilderConfigPath(workspaceJson) {
  Object.keys(workspaceJson.projects).map((k) => {
    const project = workspaceJson.projects[k];
    ['build', 'test', 'e2e'].forEach((builderCommand) => {
      if (
        isStencilProjectBuilder(project, builderCommand) &&
        !isConfigPathSet(project, builderCommand)
      ) {
        project.architect[
          builderCommand
        ].options.configPath = `${project.root}/stencil.config.ts`;
      }
    });
  });
  return workspaceJson;
}

export default function update(): Rule {
  return chain([
    displayInformation,
    updateWorkspaceInTree(updateBuilderConfigPath),
    formatFiles(),
  ]);
}
