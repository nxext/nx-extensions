import {
  cleanup,
  runNxCommandAsync,
  uniq,
  updateFile,
} from '@nx/plugin/testing';
import { newProject } from '../../e2e/src';
import { names } from '@nx/devkit';

describe('vue e2e', () => {
  // Setting up individual workspaces per
  // test can cause e2e runs to take a long time.
  // For this reason, we recommend each suite only
  // consumes 1 workspace. The tests should each operate
  // on a unique project in the workspace, such that they
  // are not dependant on one another.
  beforeAll(() => {
    newProject(['@nxext/vue']);
  });

  afterAll(() => {
    // `nx reset` kills the daemon, and performs
    // some work which can help clean up e2e leftovers
    runNxCommandAsync('reset');
    //cleanup();
  });

  describe('application', () => {
    xit('should create a vue application', async () => {
      const projectName = uniq('vuebuild');
      await runNxCommandAsync(
        `generate @nxext/vue:app ${projectName} --unitTestRunner='none'`
      );
      const result = await runNxCommandAsync(`build ${projectName}`);
      expect(result.stdout).toContain(
        `Successfully ran target build for project ${projectName}`
      );
    });

    it('should create a vue application with routing', async () => {
      const projectName = uniq('vuerouting');
      await runNxCommandAsync(
        `generate @nxext/vue:app ${projectName} --routing --unitTestRunner='none'`
      );
      const result = await runNxCommandAsync(`build ${projectName}`);
      expect(result.stdout).toContain(
        `Successfully ran target build for project ${projectName}`
      );
    });

    it('should be able to run linter', async () => {
      const projectName = uniq('vuelint');
      await runNxCommandAsync(
        `generate @nxext/vue:app ${projectName} --unitTestRunner='none' --linter='eslint'`
      );
      const result = await runNxCommandAsync(`lint ${projectName}`);
      expect(result.stdout).toContain(`All files pass linting.`);
    });

    it('should be able to run vitest', async () => {
      const projectName = uniq('vuetest');
      await runNxCommandAsync(
        `generate @nxext/vue:app ${projectName} --unitTestRunner='vitest'`
      );
      const result = await runNxCommandAsync(`test ${projectName}`);
      expect(result.stdout).toContain(`1 passed`);
      expect(result.stdout).toContain(
        `Successfully ran target test for project ${projectName}`
      );
    });
  });

  describe('library', () => {
    it('should create a vue lib and make it buildable', async () => {
      const projectName = uniq('vuelib');
      await runNxCommandAsync(
        `generate @nxext/vue:lib ${projectName} --buildable --unitTestRunner='none'`
      );
      const result = await runNxCommandAsync(`build ${projectName}`);
      expect(result.stdout).toContain(
        `Successfully ran target build for project ${projectName}`
      );
    });

    it('should be able to run vitest', async () => {
      const projectName = uniq('vuelibvitest');
      await runNxCommandAsync(
        `generate @nxext/vue:lib ${projectName} --unitTestRunner='vitest'`
      );
      const result = await runNxCommandAsync(`test ${projectName}`);
      expect(result.stdout).toContain(`1 passed`);
      expect(result.stdout).toContain(
        `Successfully ran target test for project ${projectName}`
      );
    });

    it('should be able to run linter', async () => {
      const projectName = uniq('vueliblint');
      await runNxCommandAsync(
        `generate @nxext/vue:lib ${projectName} --unitTestRunner='none' --linter='eslint'`
      );
      const result = await runNxCommandAsync(`lint ${projectName}`);
      expect(result.stdout).toContain(`All files pass linting.`);
    });
  });

  xdescribe('library reference', () => {
    it('should create a vue application with linked lib', async () => {
      const projectName = uniq('vuelinkapp');
      const libName = uniq('vuelinklib');
      const libClassName = names(libName).className;
      await runNxCommandAsync(
        `generate @nxext/vue:app ${projectName} --unitTestRunner='none' --linter='none'`
      );
      await runNxCommandAsync(
        `generate @nxext/vue:lib ${libName} --buildable --unitTestRunner='none'`
      );
      updateFile(
        `apps/${projectName}/src/App.vue`,
        `
<script setup lang="ts">
import { ${libClassName} } from '@proj/${libName}';
</script>

<template>
    <${libClassName} msg="Yey"></${libClassName}>
</template>`
      );

      const result = await runNxCommandAsync(`build ${projectName}`);
      expect(result.stdout).toContain(
        `Successfully ran target build for project ${projectName}`
      );
    });
  });
});
