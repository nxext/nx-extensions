/**
 * This script starts a local registry for e2e testing purposes.
 * It is meant to be called in jest's globalSetup.
 */
import { startLocalRegistry } from '@nx/js/plugins/jest/local-registry';
import { execFileSync } from 'child_process';
import { releasePublish, releaseVersion } from 'nx/release';

export default async () => {
  // local registry target to run
  const localRegistryTarget = 'nxext:local-registry';
  // storage folder for the local registry
  const storage = './tmp/local-registry/storage';

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
    generatorOptionsOverrides: {
      skipLockFileUpdate: true,
      packageRoot: '{projectRoot}',
      updateDependents: 'auto',
    },
  });

  execFileSync('pnpm', [
    'nx',
    'run-many',
    '-t',
    'build',
    '--exclude',
    'docs'
  ]);

  await releasePublish({
    tag: 'e2e',
    firstRelease: true,
  });
};
