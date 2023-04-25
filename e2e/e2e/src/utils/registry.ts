import { ChildProcess, fork, execSync } from 'child_process';
import * as glob from 'glob';
import {
  joinPathFragments,
  logger,
  workspaceRoot,
  getPackageManagerCommand,
} from '@nx/devkit';

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

    childFork.on('error', (err: unknown) => reject([err]));
    childFork.on('disconnect', (err: unknown) => reject([err]));
  });
}

export async function startVerdaccio(verdaccioConfig: string) {
  return runRegistry(
    ['-c', joinPathFragments(workspaceRoot, verdaccioConfig)],
    {}
  );
}

export function addUser(url: string) {
  execSync(
    `npx npm-cli-adduser -r ${url} -a -u verdacciouser -p passw0rd -e test@domain.test`
  );
}

export function buildAllPackages(exclude: string) {
  const pm = getPackageManagerCommand();
  logger.info('Build all....');
  execSync(
    pm.run(
      'nx',
      `run-many --target=build --all --parallel --exclude=${exclude} || { echo 'Build failed' ; exit 1; }`
    ),
    {
      stdio: [0, 1, 2],
    }
  );
}

export function runNpmPublish(path: string, verdaccioUrl: string) {
  try {
    const buffer = execSync(
      `npm publish -tag latest --access public --json --registry ${verdaccioUrl}`,
      {
        cwd: path,
        stdio: ['pipe', 'pipe', 'pipe'],
      }
    );
    return JSON.parse(buffer.toString());
  } catch (err) {
    logger.error(`Failed to publish: ${path}`);
    return { err: 'Failed to publish' };
  }
}

export function publishPackages(verdaccioUrl: string, distDir: string) {
  const pkgFiles = glob
    .sync(joinPathFragments(distDir, '**/package.json'))
    .map((pkgJsonPath) => pkgJsonPath.replace('package.json', ''));
  pkgFiles.forEach((distPath) => {
    const pkgInfo = runNpmPublish(distPath, verdaccioUrl);
    console.log(`📦  ${pkgInfo.name} published...`);
  });
}
