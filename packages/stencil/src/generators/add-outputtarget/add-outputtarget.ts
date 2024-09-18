import {
  formatFiles,
  logger,
  readProjectConfiguration,
  stripIndents,
  Tree,
  runTasksInSerial,
} from '@nx/devkit';
import { isBuildableStencilProject } from '../../utils/utillities';
import { AddOutputtargetSchematicSchema } from './schema';
import { addAngularGenerator } from './add-angular/generator';
import { addReactGenerator } from './add-react/generator';

export async function outputTargetGenerator(
  host: Tree,
  options: AddOutputtargetSchematicSchema
) {
  const projectConfig = readProjectConfiguration(host, options.projectName);
  const tasks = [];

  if (isBuildableStencilProject(projectConfig)) {
    if (options.outputType === 'angular') {
      tasks.push(await addAngularGenerator(host, options));
    }

    if (options.outputType === 'react') {
      tasks.push(await addReactGenerator(host, options));
    }

    if (!options.skipFormat) {
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
