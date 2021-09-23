// @ts-ignore
import { appRootPath } from '@nrwl/tao/src/utils/app-root';
import { execSync } from 'child_process';
import { copySync, removeSync } from 'fs-extra';
import { getPublishableLibNames, tmpProjPath } from './utils';

console.log('\nUpdating playground...');

const publishableLibNames = getPublishableLibNames();

publishableLibNames.forEach((plugin) => console.log(`Update ${plugin}...`));

execSync(`yarn nx run-many --target build --projects ${publishableLibNames}`);

removeSync(tmpProjPath('node_modules/@nxext'));

copySync(`${appRootPath}/dist/packages`, tmpProjPath('node_modules/@nxext'));

console.log('\nUpdate complete.');
