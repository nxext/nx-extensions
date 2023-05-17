import { execSync } from 'child_process';
import {
  ensureDirSync,
  readFileSync,
  removeSync,
  writeFileSync,
} from 'fs-extra';
import { getPublishableLibNames, tmpProjPath } from './utils';
import { dirname } from 'path';
import { logger, readJsonFile, workspaceRoot } from '@nx/devkit';
import { Workspaces } from 'nx/src/config/workspaces';
import * as glob from 'glob';

console.log('\nCreating playground. This may take a few minutes.');

const workspaceJson = new Workspaces(
  workspaceRoot
).readWorkspaceConfiguration();
const publishableLibNames = getPublishableLibNames(workspaceJson);

execSync(`npx nx run-many --target build --projects ${publishableLibNames}`);

logger.info('Remove old playground workspace...');
removeSync(tmpProjPath());
ensureDirSync(tmpProjPath());

const localTmpDir = dirname(tmpProjPath());

logger.info('Creating nx workspace...');
execSync(
  `node ${require.resolve(
    'nx'
  )} new proj --nx-workspace-root=${localTmpDir} --no-interactive --skip-install --collection=@nx/workspace --npmScope=proj --preset=empty --packageManager=yarn --nxCloud=false`,
  {
    cwd: localTmpDir,
  }
);
logger.info('Nx workspace created!');

publishableLibNames.forEach((pubLibName) => {
  try {
    logger.info(`Processing ${pubLibName} ...`);
    const { outputPath, packageJson } =
      workspaceJson.projects[pubLibName]?.targets?.build.options;
    const p = JSON.parse(readFileSync(tmpProjPath('package.json')).toString());
    p.devDependencies[
      require(`${workspaceRoot}/${packageJson}`).name
    ] = `file:${workspaceRoot}/${outputPath}`;
    writeFileSync(tmpProjPath('package.json'), JSON.stringify(p, null, 2));
  } catch (e) {
    logger.info(`Problem with ${pubLibName}`);
  }
});
logger.info(`All packages processed.`);

logger.info('Update versions...');
const tsConfigBase = readJsonFile(`${workspaceRoot}/tsconfig.base.json`);
const distPaths = Object.entries(tsConfigBase.compilerOptions.paths).reduce<
  Record<string, string>
>((acc, cur) => {
  acc[cur[0]] = `file:${workspaceRoot}/dist/${cur[1][0].split('/src')[0]}`;

  return acc;
}, {} as Record<string, string>);

let pkgFiles = glob.sync('dist/packages/**/package.json');

pkgFiles.forEach((p) => {
  const content = JSON.parse(readFileSync(p).toString());
  for (const key in content.dependencies) {
    if (key.startsWith('@nxext/')) {
      content.dependencies[key] = distPaths[key];
    }
  }
  writeFileSync(p, JSON.stringify(content, null, 2));
});

logger.info(`Running yarn install....`);
execSync('yarn install', {
  cwd: tmpProjPath(),
  stdio: ['ignore', 'ignore', 'ignore'],
});

console.log(`\nCreated playground at ${tmpProjPath()}.`);
