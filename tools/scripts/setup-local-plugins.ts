import { appRootPath } from '@nrwl/tao/src/utils/app-root';
import { execSync } from 'child_process';
import { copySync, removeSync } from 'fs-extra';
import { getPublishableLibNames } from './utils';

console.log('\nUpdating local plugins...');

const publishableLibNames = getPublishableLibNames();

execSync(`yarn nx run-many --target build --projects ${publishableLibNames}`);

removeSync(`${appRootPath}/node_modules/@nxext`);

copySync(`${appRootPath}/dist/packages`, `${appRootPath}/node_modules/@nxext`);

console.log('\nUpdate complete.');
