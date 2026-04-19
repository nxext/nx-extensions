/**
 * This script starts a local registry for e2e testing purposes.
 * It is meant to be called in jest's globalSetup.
 */
import { startLocalRegistry } from '@nx/js/plugins/jest/local-registry';
import { execFileSync } from 'child_process';
import { rmSync } from 'fs';
import { join } from 'path';
import { releasePublish, releaseVersion } from 'nx/release';

export default async () => {
  process.env.NX_NO_CLOUD = 'true';
  process.env.NX_DAEMON = 'false';

  const localRegistryTarget = 'nxext:local-registry';
  const storage = './tmp/local-registry/storage';

  rmSync(join(process.cwd(), storage), { recursive: true, force: true });

  global.stopLocalRegistry = await startLocalRegistry({
    localRegistryTarget,
    storage,
    verbose: process.env.NX_VERBOSE_LOGGING === 'true',
  });

  await releaseVersion({
    specifier: '0.0.1-e2e',
    stageChanges: false,
    gitCommit: false,
    gitTag: false,
    firstRelease: true,
    versionActionsOptionsOverrides: {
      skipLockFileUpdate: true,
      packageRoot: '{projectRoot}',
      updateDependents: 'auto',
    },
  });

  execFileSync('pnpm', ['nx', 'run-many', '-t', 'build', '--exclude', 'docs'], {
    env: process.env,
    stdio: 'inherit',
  });

  await releasePublish({
    tag: 'e2e',
    firstRelease: true,
  });
};
