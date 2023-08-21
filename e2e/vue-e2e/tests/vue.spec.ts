import { runNxCommandAsync, uniq, updateFile } from '@nx/plugin/testing';
import { names } from '@nx/devkit';
import { createTestProject, installPlugin } from '@nxext/e2e-utils';
import { rmSync } from 'fs';

describe('vue e2e', () => {
  let projectDirectory: string;

  beforeAll(() => {
    projectDirectory = createTestProject();
    installPlugin(projectDirectory, 'vue');
  });

  afterAll(() => {
    // Cleanup the test project
    /*rmSync(projectDirectory, {
      recursive: true,
      force: true,
    });*/
  });

  describe('application', () => {
    it('should create a vue application with routing', async () => {
      const projectName = uniq('vue-routing');
      await runNxCommandAsync(
        `generate @nxext/vue:app ${projectName} --routing --unitTestRunner='none' --e2eTestRunner='none'`
      );
      const result = await runNxCommandAsync(`build ${projectName}`);
      expect(result.stdout).toContain(
        `Successfully ran target build for project ${projectName}`
      );
    });

    it('should be able to run linter', async () => {
      const projectName = uniq('vue-lint');
      await runNxCommandAsync(
        `generate @nxext/vue:app ${projectName} --unitTestRunner='none' --e2eTestRunner='none' --linter='eslint'`
      );
      const result = await runNxCommandAsync(`lint ${projectName}`);
      expect(result.stdout).toContain(`All files pass linting.`);
    });

    it('should be able to run vitest', async () => {
      const projectName = uniq('vue-test');
      await runNxCommandAsync(
        `generate @nxext/vue:app ${projectName} --unitTestRunner='vitest' --e2eTestRunner='none'`
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
      const projectName = uniq('vue-lib');
      await runNxCommandAsync(
        `generate @nxext/vue:lib ${projectName} --buildable --unitTestRunner='none'`
      );
      const result = await runNxCommandAsync(`build ${projectName}`);
      expect(result.stdout).toContain(
        `Successfully ran target build for project ${projectName}`
      );
    });

    it('should be able to run vitest', async () => {
      const projectName = uniq('vue-libvitest');
      await runNxCommandAsync(
        `generate @nxext/vue:lib ${projectName} --unitTestRunner='vitest' --e2eTestRunner='none'`
      );
      const result = await runNxCommandAsync(`test ${projectName}`);
      expect(result.stdout).toContain(`1 passed`);
      expect(result.stdout).toContain(
        `Successfully ran target test for project ${projectName}`
      );
    });

    it('should be able to run linter', async () => {
      const projectName = uniq('vue-liblint');
      await runNxCommandAsync(
        `generate @nxext/vue:lib ${projectName} --unitTestRunner='none' --e2eTestRunner='none' --linter='eslint'`
      );
      const result = await runNxCommandAsync(`lint ${projectName}`);
      expect(result.stdout).toContain(`All files pass linting.`);
    });
  });

  describe('library reference', () => {
    it('should create a vue application with linked lib', async () => {
      const projectName = uniq('vue-linkapp');
      const libName = uniq('vue-linklib');
      const libClassName = names(libName).className;
      await runNxCommandAsync(
        `generate @nxext/vue:app ${projectName} --unitTestRunner='none' --e2eTestRunner='none' --linter='none'`
      );
      await runNxCommandAsync(
        `generate @nxext/vue:lib ${libName} --buildable --unitTestRunner='none' --e2eTestRunner='none'`
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
      const projectName = uniq('vue-storybook');
      await runNxCommandAsync(
        `generate @nxext/vue:lib ${projectName} --buildable --unitTestRunner='none' --e2eTestRunner='none'`
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

  describe('e2e tests', () => {
    it('should be able to run cypress', async () => {
      const projectName = uniq('vue-e2e-cypress');
      await runNxCommandAsync(
        `generate @nxext/vue:app ${projectName} --unitTestRunner='none' --e2eTestRunner='cypress'`
      );
      const result = await runNxCommandAsync(`e2e ${projectName}-e2e`);
      expect(result.stdout).toContain(`app.cy.ts`);
      expect(result.stdout).toContain(`All specs passed!`);
    });

    xit('should be able to run playwright', async () => {
      const projectName = uniq('vue-e2e-playwright');
      await runNxCommandAsync(
        `generate @nxext/vue:app ${projectName} --unitTestRunner='none' --e2eTestRunner='playwright'`
      );
      const result = await runNxCommandAsync(`e2e ${projectName}-e2e`);
      expect(result.stdout).toContain(
        `Successfully ran target e2e for ${projectName}-e2e`
      );
    });
  });
});
