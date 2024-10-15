import { AppType } from './../../utils/typings';
import {
  formatFiles,
  generateFiles,
  getWorkspaceLayout,
  names,
  offsetFromRoot,
  Tree,
  runTasksInSerial,
  readNxJson,
} from '@nx/devkit';
import { ApplicationSchema, RawApplicationSchema } from './schema';
import { calculateStyle } from '../../utils/utillities';
import { initGenerator } from '../init/init';
import { join } from 'path';
import { addProject } from './lib/add-project';
import { addLinting } from './lib/add-linting';
import { addCypress } from './lib/add-cypress';
import {
  determineProjectNameAndRootOptions,
  ensureProjectName,
} from '@nx/devkit/src/generators/project-name-and-root-utils';
import { assertNotUsingTsSolutionSetup } from '@nx/js/src/utils/typescript/ts-solution-setup';

async function normalizeOptions(
  host: Tree,
  options: RawApplicationSchema
): Promise<ApplicationSchema> {
  await ensureProjectName(host, options, 'application');
  const { projectName, projectRoot } = await determineProjectNameAndRootOptions(
    host,
    {
      name: options.name,
      projectType: 'application',
      directory: options.directory,
    }
  );

  const parsedTags = options.tags
    ? options.tags.split(',').map((s) => s.trim())
    : [];

  const nxJson = readNxJson(host);

  let e2eWebServerTarget = 'serve';
  let e2ePort = 4200;
  if (
    nxJson.targetDefaults?.[e2eWebServerTarget] &&
    nxJson.targetDefaults?.[e2eWebServerTarget].options?.port
  ) {
    e2ePort = nxJson.targetDefaults?.[e2eWebServerTarget].options?.port;
  }

  const e2eProjectName = `${projectName}-e2e`;
  const e2eProjectRoot = `${projectRoot}-e2e`;
  const e2eWebServerAddress = `http://localhost:${e2ePort}`;

  const style = calculateStyle(options.style);

  const appType = AppType.application;

  return {
    ...options,
    name: projectName,
    projectName,
    projectRoot,
    projectDirectory: projectRoot,
    parsedTags,
    e2eProjectName,
    e2eProjectRoot,
    e2eWebServerAddress,
    e2eWebServerTarget,
    style,
    appType,
  };
}

function createFiles(host: Tree, options: ApplicationSchema) {
  generateFiles(host, join(__dirname, './files/app'), options.projectRoot, {
    ...options,
    ...names(options.name),
    offsetFromRoot: offsetFromRoot(options.projectRoot),
  });

  if (options.unitTestRunner === 'none') {
    host.delete(
      `${options.projectRoot}/src/components/app-home/app-home.spec.ts`
    );
    host.delete(
      `${options.projectRoot}/src/components/app-root/app-root.spec.ts`
    );
    host.delete(
      `${options.projectRoot}/src/components/app-profile/app-profile.spec.ts`
    );
  }
}

export async function applicationGenerator(
  host: Tree,
  schema: RawApplicationSchema
) {
  assertNotUsingTsSolutionSetup(host, '@nxext/stencil', 'application');

  const options = await normalizeOptions(host, schema);
  const initTask = await initGenerator(host, {
    ...options,
    skipFormat: true,
  });

  createFiles(host, options);
  addProject(host, options);
  const lintTask = await addLinting(host, options);
  const cypressTask = await addCypress(host, options);

  if (!options.skipFormat) {
    await formatFiles(host);
  }

  return runTasksInSerial(initTask, lintTask, cypressTask);
}

export default applicationGenerator;
