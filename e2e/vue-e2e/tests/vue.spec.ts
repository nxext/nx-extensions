import { runNxCommandAsync, uniq, updateFile } from '@nx/plugin/testing';
import { names } from '@nx/devkit';
import { createTestProject, installPlugin } from '@nxext/e2e-utils';
import { rmSync } from 'fs';

xdescribe('vue e2e', () => {
  let projectDirectory: string;

  beforeAll(() => {
    projectDirectory = createTestProject();
    installPlugin(projectDirectory, 'vue');
  });

  afterAll(() => {
    // Cleanup the test project
    rmSync(projectDirectory, {
      recursive: true,
      force: true,
    });
  });

  describe('application', () => {
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

  describe('library reference', () => {
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

  describe('storybook', () => {
    it('should create a vue lib and add storybook', async () => {
      const projectName = uniq('vuestorybook');
      await runNxCommandAsync(
        `generate @nxext/vue:lib ${projectName} --buildable --unitTestRunner='none'`
      );
      await runNxCommandAsync(
        `generate @nxext/vue:storybook-configuration ${projectName}`
      );

      const result = await runNxCommandAsync(`build ${projectName}`);
      expect(result.stdout).toContain(
        `Successfully ran target build for project ${projectName}`
      );
    });
  });
});
