import { appRootPath } from '@nrwl/workspace/src/utils/app-root';
import { execSync } from 'child_process';
import { copySync, removeSync } from 'fs-extra';
import { getPublishableLibNames, tmpProjPath } from './utils';

console.log('\nUpdating playground...');

const publishableLibNames = getPublishableLibNames();

execSync(`yarn nx run-many --target build --projects ${publishableLibNames}`);

removeSync(tmpProjPath('node_modules/@nxext'));

copySync(`${appRootPath}/dist/packages`, tmpProjPath('node_modules/@nxext'));

console.log('\nUpdate complete.');
