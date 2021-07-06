import { prepareVueLibrary } from './lib/vue';
import { prepareReactLibrary } from './lib/react';
import { prepareAngularLibrary } from './lib/angular';
import { addToOutputTargetToConfig } from './lib/add-outputtarget-to-config';
import { convertNxGenerator, formatFiles, logger, readProjectConfiguration, stripIndents, Tree } from '@nrwl/devkit';
import { isBuildableStencilProject } from '../../utils/utillities';
import { AddOutputtargetSchematicSchema } from './schema';
import { runTasksInSerial } from '@nrwl/workspace/src/utilities/run-tasks-in-serial';

/*
function checkBuildable(options: AddOutputtargetSchematicSchema): Rule {
  return (tree: Tree) => {
    const workspaceJson = readJsonInTree(tree, getWorkspacePath(tree));
    const project = workspaceJson.projects[options.projectName];

    if (isStencilProjectBuilder(project, 'build')) {
      return chain([
        options.outputType === 'react' ? prepareReactLibrary(options) : noop(),
        options.outputType === 'angular'
          ? prepareAngularLibrary(options)
          : noop(),
        options.outputType === 'vue' ? prepareVueLibrary(options) : noop(),
        addToOutputTargetToConfig(options.projectName, options.outputType),
        formatFiles(),
      ]);
    } else {
      logger.info(stripIndents`
          Please use a buildable library for custom outputtargets

          You could make this library buildable with:

          nx generate @nxext/stencil:make-lib-buildable ${options.projectName}
          or
          ng generate @nxext/stencil:make-lib-buildable ${options.projectName}
        `);
      return noop();
    }
  };
}*/

export async function outputtargetGenerator(host: Tree, options: AddOutputtargetSchematicSchema) {
  const projectConfig = readProjectConfiguration(host, options.projectName);
  const tasks = [];

  if(isBuildableStencilProject(projectConfig)) {
    if(options.outputType === 'react') {
      tasks.push(await prepareReactLibrary(host, options));
    }

    if(options.outputType === 'angular') {
      tasks.push(await prepareAngularLibrary(host, options));
    }

    if(options.outputType === 'vue') {
      await prepareVueLibrary(host, options);
    }

    await addToOutputTargetToConfig(host, options.projectName, options.outputType);

    if(options.skipFormat) {
      await formatFiles(host);
    }
  } else {
    logger.info(stripIndents`
      Please use a buildable library for custom outputtargets

      You could make this library buildable with:

      nx generate @nxext/stencil:make-lib-buildable ${options.projectName}
      or
      ng generate @nxext/stencil:make-lib-buildable ${options.projectName}
    `);
  }

  return runTasksInSerial(...tasks);
}

export default outputtargetGenerator;
export const outputtargetSchematic = convertNxGenerator(outputtargetGenerator);
