/**
 * This script starts a local registry for e2e testing purposes.
 * It is meant to be called in jest's globalSetup.
 */
import { startLocalRegistry } from '@nx/js/plugins/jest/local-registry';
import { releasePublish, releaseVersion } from 'nx/release';

export default async () => {
  if (
    process.env.SKIP_LOCAL_REGISTRY_GLOBAL_SETUP &&
    process.env.SKIP_LOCAL_REGISTRY_GLOBAL_SETUP !== 'false'
  ) {
    console.log(
      "Environment variable 'SKIP_LOCAL_REGISTRY_GLOBAL_SETUP' is set. Skipping global setup of Verdaccio's Local Registry..."
    );
    return;
  }

  // local registry target to run
  const localRegistryTarget = 'nxext:local-registry';
  // storage folder for the local registry
  const storage = './tmp/local-registry/storage';

  global.stopLocalRegistry = await startLocalRegistry({
    localRegistryTarget,
    storage,
    verbose: false,
  });
  await releaseVersion({
    specifier: '0.0.0-e2e',
    stageChanges: false,
    gitCommit: false,
    gitTag: false,
    firstRelease: true,
    generatorOptionsOverrides: {
      skipLockFileUpdate: true,
    },
  });
  await releasePublish({
    tag: 'e2e',
    firstRelease: true,
  });
};
