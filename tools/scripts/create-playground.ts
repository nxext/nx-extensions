import { execSync } from 'child_process';
import {
  ensureDirSync,
  readFileSync,
  removeSync,
  writeFileSync,
} from 'fs-extra';
import { getPublishableLibNames, tmpProjPath } from './utils';
import { dirname, basename } from 'path';
import {
  logger,
  readCachedProjectGraph,
  readJsonFile,
  readProjectsConfigurationFromProjectGraph,
  workspaceRoot,
} from '@nx/devkit';
import * as glob from 'glob';

console.log('\nCreating playground. This may take a few minutes.');

const workspaceJson = readProjectsConfigurationFromProjectGraph(
  readCachedProjectGraph()
);
const publishableLibNames = getPublishableLibNames(workspaceJson);

execSync(`npx nx run-many --target build --projects ${publishableLibNames}`);

logger.info('Remove old playground workspace...');
removeSync(tmpProjPath());
ensureDirSync(tmpProjPath());

const localTmpDir = dirname(tmpProjPath());
const baseName = basename(tmpProjPath());

logger.info('Creating nx workspace...');
execSync(
  `npx --yes create-nx-workspace@latest ${baseName} --preset apps --nxCloud skip --no-interactive`,
  {
    cwd: localTmpDir,
    stdio: 'inherit',
    env: process.env,
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
const distPaths = Object.entries<string>(
  tsConfigBase.compilerOptions.paths
).reduce<Record<string, string>>((acc, cur) => {
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

logger.info(`Running pnpm install....`);
execSync('pnpm install', {
  cwd: tmpProjPath(),
  stdio: ['ignore', 'ignore', 'ignore'],
});

console.log(`\nCreated playground at ${tmpProjPath()}.`);
