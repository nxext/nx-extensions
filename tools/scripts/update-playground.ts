// @ts-ignore
import { execSync } from 'child_process';
import { readFileSync, removeSync, writeFileSync } from 'fs-extra';
import { copyAndRename, getPublishableLibNames, tmpProjPath } from './utils';
import { Workspaces } from 'nx/src/config/workspaces';
import { logger, readJsonFile, workspaceRoot } from '@nx/devkit';
import * as glob from 'glob';

console.log('\nUpdating playground...');

const workspaceJson = new Workspaces(
  workspaceRoot
).readWorkspaceConfiguration();

const publishableLibNames = getPublishableLibNames(workspaceJson);

publishableLibNames.forEach((plugin) => console.log(`Update ${plugin}...`));

execSync(`yarn nx run-many --target build --projects ${publishableLibNames}`);

removeSync(tmpProjPath('node_modules/@nxext'));

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

publishableLibNames.forEach((pubLibName) => {
  try {
    const { outputPath, packageJson } =
      workspaceJson.projects[pubLibName]?.targets?.build.options;
    const packageName = require(`${workspaceRoot}/${packageJson}`).name;
    copyAndRename(
      `${workspaceRoot}/${outputPath}`,
      tmpProjPath(`node_modules/${packageName}`)
    );
  } catch (e) {
    logger.info(`Problem with ${pubLibName}`);
  }
});

console.log('\nUpdate complete.');
