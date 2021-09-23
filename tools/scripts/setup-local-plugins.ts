// @ts-ignore
import { appRootPath } from '@nrwl/tao/src/utils/app-root';
import { execSync } from 'child_process';
import { copySync, removeSync } from 'fs-extra';

console.log('\nUpdating local stencil plugin...');

execSync(`yarn nx build stencil`);

removeSync(`${appRootPath}/node_modules/@nxext`);

copySync(`${appRootPath}/dist/packages/stencil`, `${appRootPath}/node_modules/@nxext/stencil`);

console.log('\nUpdate complete.');
