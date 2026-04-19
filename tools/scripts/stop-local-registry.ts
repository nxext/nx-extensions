/**
 * This script stops the local registry for e2e testing purposes.
 * It is meant to be called in jest's globalTeardown.
 */
import { execSync } from 'child_process';

export default () => {
  if (global.stopLocalRegistry) {
    global.stopLocalRegistry();
  }

  // `releaseVersion` in start-local-registry.ts rewrites every publishable
  // package.json in-place to the e2e version. Those edits are not meant to
  // persist — restore them so the working tree is clean after every run.
  try {
    execSync('git checkout -- packages/*/package.json', {
      stdio: 'ignore',
    });
  } catch {
    // Best-effort: if we're outside a git checkout (e.g. a tarball) just skip.
  }
};
