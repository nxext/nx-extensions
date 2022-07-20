// @ts-ignore
import { execSync } from 'child_process';
import { removeSync } from 'fs-extra';
import { copyAndRename, getPublishableLibNames, tmpProjPath } from './utils';
import { Workspaces } from 'nx/src/config/workspaces';
import { workspaceRoot } from '@nrwl/tao/src/utils/app-root';

console.log('\nUpdating playground...');

const workspaceJson = new Workspaces(
  workspaceRoot
).readWorkspaceConfiguration();

const publishableLibNames = getPublishableLibNames(workspaceJson);

publishableLibNames.forEach((plugin) => console.log(`Update ${plugin}...`));

execSync(`yarn nx run-many --target build --projects ${publishableLibNames}`);

removeSync(tmpProjPath('node_modules/@nxext'));

publishableLibNames.forEach((pubLibName) => {
  const { outputPath, packageJson } =
    workspaceJson.projects[pubLibName]?.targets?.build.options;
  const packageName = require(`${workspaceRoot}/${packageJson}`).name;
  copyAndRename(
    `${workspaceRoot}/${outputPath}`,
    tmpProjPath(`node_modules/${packageName}`)
  );
});

console.log('\nUpdate complete.');
