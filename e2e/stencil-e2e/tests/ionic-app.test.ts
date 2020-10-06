import {
  ensureNxProject,
  runNxCommandAsync,
  uniq
} from '@nrwl/nx-plugin/testing';
import { addPackageBeforeTest } from '../utils/testing';

describe('e2e-ionic-app', () => {
  let plugin: string;

  beforeEach(() => {
    plugin = uniq('ionic-app');
    ensureNxProject('@nxext/stencil', 'dist/packages/stencil');
    addPackageBeforeTest("@nxtend/capacitor", "^1.0.0");
  });

  describe('stencil ionic app builder', () => {
    // Disabled until the capacitor plugin works on windows
    xit(`should build ionic app`, async (done) => {
      await runNxCommandAsync(
        `generate @nxext/stencil:ionic-app ${plugin} --style='css'`
      );

      const result = await runNxCommandAsync(`build ${plugin} --dev`);
      expect(result.stdout).toContain('build finished');

      done();
    });
  });
});
