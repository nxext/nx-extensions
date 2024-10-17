import { AppType } from './../../utils/typings';
import {
  formatFiles,
  generateFiles,
  names,
  offsetFromRoot,
  Tree,
  runTasksInSerial,
  readNxJson,
} from '@nx/devkit';
import { initGenerator as jsInitGenerator } from '@nx/js';
import { ApplicationSchema, RawApplicationSchema } from './schema';
import { calculateStyle } from '../../utils/utillities';
import { initGenerator } from '../init/init';
import { join } from 'path';
import { EOL } from 'node:os';
import { addProject } from './lib/add-project';
import { addLinting } from './lib/add-linting';
import { addCypress } from './lib/add-cypress';
import {
  determineProjectNameAndRootOptions,
  ensureProjectName,
} from '@nx/devkit/src/generators/project-name-and-root-utils';
import { assertNotUsingTsSolutionSetup } from '@nx/js/src/utils/typescript/ts-solution-setup';
import { logShowProjectCommand } from '@nx/devkit/src/utils/log-show-project-command';

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

  const jsInitTask = await jsInitGenerator(host, {
    ...options,
    tsConfigName: 'tsconfig.base.json',
    skipFormat: true,
  });

  const initTask = await initGenerator(host, {
    ...options,
    skipFormat: true,
  });

  createFiles(host, options);
  addProject(host, options);
  const lintTask = await addLinting(host, options);
  const cypressTask = await addCypress(host, options);

  const ignoresToUpdate = ['.gitignore', '.prettierignore', '.nxignore'];
  const toBeIgnored = ['.stencil'].join(EOL);
  ignoresToUpdate.forEach((ignoreFile) => {
    if (host.exists(ignoreFile)) {
      const gitignoreContent = host.read(ignoreFile, 'utf-8');
      if (!gitignoreContent.includes('.stencil')) {
        host.write(
          ignoreFile,
          `${gitignoreContent}

${toBeIgnored}
`
        );
      }
    }
  });

  if (!options.skipFormat) {
    await formatFiles(host);
  }

  return runTasksInSerial(jsInitTask, initTask, lintTask, cypressTask, () =>
    logShowProjectCommand(options.projectName)
  );
}

export default applicationGenerator;
