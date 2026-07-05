/**
 * This script starts a local registry for e2e testing purposes.
 * It is meant to be called in jest's globalSetup.
 */
import { startLocalRegistry } from '@nx/js/plugins/jest/local-registry';
import { execFileSync } from 'child_process';
import { existsSync, readdirSync, readFileSync, rmSync } from 'fs';
import { join } from 'path';
import { releasePublish, releaseVersion } from 'nx/release';

export default async () => {
  process.env.NX_NO_CLOUD = 'true';
  process.env.NX_DAEMON = 'false';

  const localRegistryTarget = 'nxext:local-registry';
  const storage = './tmp/local-registry/storage';

  rmSync(join(process.cwd(), storage), { recursive: true, force: true });

  // Snapshot every publishable package.json BEFORE releaseVersion rewrites
  // them in place. The teardown restores from this snapshot instead of
  // `git checkout`, which would also destroy uncommitted package.json edits
  // (and thereby corrupt the packages published by any later e2e suite in
  // the same run).
  global.packageJsonSnapshots = Object.fromEntries(
    readdirSync(join(process.cwd(), 'packages'), { withFileTypes: true })
      .filter((entry) => entry.isDirectory())
      .map((entry) =>
        join(process.cwd(), 'packages', entry.name, 'package.json')
      )
      .filter((file) => existsSync(file))
      .map((file) => [file, readFileSync(file, 'utf-8')])
  );

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

  // --skip-nx-cache: the releaseVersion() call above rewrites every
  // packages/*/package.json in place seconds before this build; cached task
  // hashes can miss those rewrites and publish stale 23.x dists under the
  // 0.0.1-e2e version, breaking installs with ERR_PNPM_NO_MATCHING_VERSION.
  execFileSync(
    'pnpm',
    ['nx', 'run-many', '-t', 'build', '--exclude', 'docs', '--skip-nx-cache'],
    {
      env: process.env,
      stdio: 'inherit',
    }
  );

  await releasePublish({
    tag: 'e2e',
    firstRelease: true,
  });
};
