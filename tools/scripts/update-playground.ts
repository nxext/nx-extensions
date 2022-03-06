// @ts-ignore
import { appRootPath } from '@nrwl/tao/src/utils/app-root';
import { readWorkspaceJson } from '@nrwl/workspace';
import { execSync } from 'child_process';
import { removeSync } from 'fs-extra';
import { copyAndRename, getPublishableLibNames, tmpProjPath } from './utils';

console.log('\nUpdating playground...');

const workspaceJson = readWorkspaceJson();

const publishableLibNames = getPublishableLibNames(workspaceJson);

publishableLibNames.forEach((plugin) => console.log(`Update ${plugin}...`));

execSync(`yarn nx run-many --target build --projects ${publishableLibNames}`);

removeSync(tmpProjPath('node_modules/@nxext'));

publishableLibNames.forEach((pubLibName) => {
  const { outputPath, packageJson } =
    workspaceJson.projects[pubLibName]?.targets?.build.options;
  const packageName = require(`${appRootPath}/${packageJson}`).name;
  copyAndRename(
    `${appRootPath}/${outputPath}`,
    tmpProjPath(`node_modules/${packageName}`)
  );
});

console.log('\nUpdate complete.');
