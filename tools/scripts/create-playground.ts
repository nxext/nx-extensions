import { readWorkspaceJson } from '@nrwl/workspace';
// @ts-ignore
import { workspaceRoot } from '@nrwl/tao/src/utils/app-root';
import { execSync } from 'child_process';
import {
  ensureDirSync,
  readFileSync,
  removeSync,
  writeFileSync,
} from 'fs-extra';
import { getPublishableLibNames, tmpProjPath } from './utils';
import { dirname } from 'path';
import { logger } from '@nrwl/devkit';

console.log('\nCreating playground. This may take a few minutes.');

const workspaceJson = readWorkspaceJson();
const publishableLibNames = getPublishableLibNames(workspaceJson);

execSync(`npx nx run-many --target build --projects ${publishableLibNames}`);

logger.info('Remove old playground workspace...');
removeSync(tmpProjPath());
ensureDirSync(tmpProjPath());

const localTmpDir = dirname(tmpProjPath());

logger.info('Creating nx workspace...');
execSync(
  `node ${require.resolve(
    '@nrwl/tao'
  )} new proj --nx-workspace-root=${localTmpDir} --no-interactive --skip-install --collection=@nrwl/workspace --npmScope=proj --preset=empty --packageManager=yarn --nxCloud=false`,
  {
    cwd: localTmpDir,
  }
);
logger.info('Nx wortkspace created!');

publishableLibNames.forEach((pubLibName) => {
  logger.info(`Processing ${pubLibName} ...`);
  const { outputPath, packageJson } =
    workspaceJson.projects[pubLibName]?.targets?.build.options;
  const p = JSON.parse(readFileSync(tmpProjPath('package.json')).toString());
  p.devDependencies[
    require(`${workspaceRoot}/${packageJson}`).name
  ] = `file:${workspaceRoot}/${outputPath}`;
  writeFileSync(tmpProjPath('package.json'), JSON.stringify(p, null, 2));
});
logger.info(`All packages processed.`);

logger.info(`Running yarn install....`);
execSync('yarn install', {
  cwd: tmpProjPath(),
  stdio: ['ignore', 'ignore', 'ignore'],
});

console.log(`\nCreated playground at ${tmpProjPath()}.`);
