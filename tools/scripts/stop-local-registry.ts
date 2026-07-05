/**
 * This script stops the local registry for e2e testing purposes.
 * It is meant to be called in jest's globalTeardown.
 */
import { writeFileSync } from 'fs';

export default () => {
  if (global.stopLocalRegistry) {
    global.stopLocalRegistry();
  }

  // `releaseVersion` in start-local-registry.ts rewrites every publishable
  // package.json in-place to the e2e version. Restore the exact pre-run
  // contents from the snapshot taken in globalSetup. (A `git checkout` here
  // would instead reset to HEAD and destroy uncommitted package.json edits —
  // corrupting what later e2e suites in the same run publish.)
  const snapshots: Record<string, string> = global.packageJsonSnapshots ?? {};
  for (const [file, content] of Object.entries(snapshots)) {
    try {
      writeFileSync(file, content);
    } catch {
      // Best-effort restore; a missing file just stays as-is.
    }
  }
};
