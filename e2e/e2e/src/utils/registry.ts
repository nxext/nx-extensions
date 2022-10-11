import { ChildProcess, fork, execSync } from 'child_process';
import * as glob from 'glob';
import { joinPathFragments, logger, workspaceRoot } from '@nrwl/devkit';

export function runRegistry(
  args: string[] = [],
  // eslint-disable-next-line @typescript-eslint/ban-types
  childOptions: {}
): Promise<ChildProcess> {
  return new Promise((resolve, reject) => {
    const childFork = fork(
      require.resolve('verdaccio/bin/verdaccio'),
      args,
      childOptions
    );

    childFork.on('message', (msg: { verdaccio_started: boolean }) => {
      if (msg.verdaccio_started) {
        resolve(childFork);
      }
    });

    childFork.on('error', (err: any) => reject([err]));
    childFork.on('disconnect', (err: any) => reject([err]));
  });
}

export async function startVerdaccio(verdaccioConfig: string) {
  const port = 4872;
  return runRegistry(
    ['-c', joinPathFragments(workspaceRoot, verdaccioConfig), '-l', `${port}`],
    {}
  );
}

export function addUser(url: string) {
  execSync(
    `npx npm-cli-adduser -r ${url} -a -u verdacciouser -p passw0rd -e test@domain.test`
  );
}

export function buildAllPackages() {
  logger.info('Build all....');
  execSync(
    `npx nx run-many --target=build --all --parallel --exclude=e2e,docs,angular-vite,angular-nx,angular-swc || { echo 'Build failed' ; exit 1; }`,
    {
      stdio: ['pipe', 'pipe', 'pipe'],
    }
  );
}

export function runNpmPublish(path: string, verdaccioUrl: string) {
  const buffer = execSync(
    `npm publish -tag latest --access public --json --registry ${verdaccioUrl}`,
    {
      cwd: path,
      stdio: ['pipe', 'pipe', 'pipe'],
    }
  );
  return JSON.parse(buffer.toString());
}

export function publishPackages(verdaccioUrl: string) {
  const pkgFiles = glob
    .sync('dist/packages/**/package.json')
    .map((pkgJsonPath) => pkgJsonPath.replace('package.json', ''));
  pkgFiles.forEach((distPath) => {
    const pkgInfo = runNpmPublish(distPath, verdaccioUrl);
    console.log(`📦  ${pkgInfo.name} published...`);
  });
}
