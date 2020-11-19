import { readWorkspaceJson } from '@nrwl/workspace';
import { appRootPath } from '@nrwl/workspace/src/utils/app-root';
import { execSync } from 'child_process';
import {
  ensureDirSync,
  readFileSync,
  removeSync,
  writeFileSync,
} from 'fs-extra';
import { getPublishableLibNames, tmpProjPath } from './utils';

console.log('\nCreating playground. This may take a few minutes.');

const workspaceJson = readWorkspaceJson();
const publishableLibNames = getPublishableLibNames(workspaceJson);

execSync(`yarn nx run-many --target build --projects ${publishableLibNames}`);

ensureDirSync(tmpProjPath());

removeSync(tmpProjPath());

execSync(
  `node ${require.resolve(
    '@nrwl/tao'
  )} new proj --no-interactive --skip-install --collection=@nrwl/workspace --npmScope=proj --preset=empty`,
  { cwd: './tmp/nx-playground' }
);

publishableLibNames.forEach((pubLibName) => {
  const { outputPath, packageJson } = workspaceJson.projects[
    pubLibName
  ].architect.build.options;
  const p = JSON.parse(readFileSync(tmpProjPath('package.json')).toString());
  p.devDependencies[
    require(`${appRootPath}/${packageJson}`).name
  ] = `file:${appRootPath}/${outputPath}`;
  writeFileSync(tmpProjPath('package.json'), JSON.stringify(p, null, 2));
});

execSync('yarn install', {
  cwd: tmpProjPath(),
  stdio: ['ignore', 'ignore', 'ignore'],
});

console.log(`\nCreated playground at ${tmpProjPath()}.`);
