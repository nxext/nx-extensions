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

  console.log('Verbose: ', process.env.NX_VERBOSE_LOGGING === 'true');

  global.stopLocalRegistry = await startLocalRegistry({
    localRegistryTarget,
    storage,
    verbose: true,
  });

  await releaseVersion({
    specifier: '0.0.0-e2e',
    stageChanges: false,
    gitCommit: false,
    gitTag: false,
    firstRelease: true,
    generatorOptionsOverrides: {
      skipLockFileUpdate: true,
      packageRoot: '{projectRoot}',
      updateDependents: 'auto',
    },
    verbose: true,
  });

  console.log('Running build for all packages...');
  execFileSync('pnpm', [
    'nx',
    'run-many',
    '-t',
    'build',
    '--exclude',
    'docs',
    '--skipNxCache',
  ]);

  console.log('Running Publish...');
  await releasePublish({
    tag: 'e2e',
    firstRelease: true,
    verbose: true,
  });
};
