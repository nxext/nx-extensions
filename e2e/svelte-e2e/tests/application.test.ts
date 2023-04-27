import {
  checkFilesExist,
  cleanup,
  readJson,
  runNxCommand,
  runNxCommandAsync,
  uniq,
  updateFile,
} from '@nx/plugin/testing';
import { newProject } from '../../e2e/src';

describe('svelte e2e', () => {
  beforeAll(() => {
    newProject(['@nxext/svelte']);
  });

  afterAll(() => {
    // `nx reset` kills the daemon, and performs
    // some work which can help clean up e2e leftovers
    runNxCommand('reset');
    cleanup();
  });

  describe('Svelte app', () => {
    it('should build svelte application', async () => {
      const plugin = uniq('svelte');
      await runNxCommandAsync(
        `generate @nxext/svelte:app ${plugin} --e2eTestRunner='none' --unitTestRunner='none'`
      );

      const result = await runNxCommandAsync(`build ${plugin}`);
      expect(result.stdout).toContain('Bundle complete');

      expect(() =>
        checkFilesExist(`dist/apps/${plugin}/index.html`)
      ).not.toThrow();
    });

    it('should add tags to project', async () => {
      const plugin = uniq('sveltetags');
      await runNxCommandAsync(
        `generate @nxext/svelte:app ${plugin} --tags e2etag,e2ePackage --e2eTestRunner='none' --unitTestRunner='none'`
      );
      const project = readJson(`apps/${plugin}/project.json`);
      expect(project.tags).toEqual(['e2etag', 'e2ePackage']);
    });

    it('should generate app into directory', async () => {
      await runNxCommandAsync(
        `generate @nxext/svelte:app project/ui --e2eTestRunner='none' --unitTestRunner='none'`
      );
      expect(() =>
        checkFilesExist(`apps/project/ui/src/main.ts`)
      ).not.toThrow();
    });

    it('should be able to run linter', async () => {
      const plugin = uniq('sveltelint');
      await runNxCommandAsync(
        `generate @nxext/svelte:app ${plugin} --e2eTestRunner='none' --unitTestRunner='none'`
      );

      const result = await runNxCommandAsync(`lint ${plugin}`);
      expect(result.stdout).toContain('All files pass linting');
    });

    it('should be able to run check', async () => {
      const plugin = uniq('svelteappcheck');
      await runNxCommandAsync(
        `generate @nxext/svelte:app ${plugin} --e2eTestRunner='none' --unitTestRunner='none'`
      );

      const result = await runNxCommandAsync(`check ${plugin}`);
      expect(result.stdout).toContain(
        'svelte-check found 0 errors, 0 warnings, and 0 hints'
      );
    });

    it('should be able to run tests with jest', async () => {
      const plugin = uniq('svelteapptests');
      await runNxCommandAsync(
        `generate @nxext/svelte:app ${plugin} --unitTestRunner=jest --e2eTestRunner='none'`
      );
      await runNxCommandAsync(
        `generate @nxext/svelte:component test --project=${plugin}`
      );

      const result = await runNxCommandAsync(`test ${plugin}`);
      expect(`${result.stdout}${result.stderr}`).toContain(
        'Ran all test suites'
      );
    });

    it('should be able to run tests with vitest', async () => {
      const plugin = uniq('svelteapptests');
      await runNxCommandAsync(
        `generate @nxext/svelte:app ${plugin} --unitTestRunner='vitest' --e2eTestRunner='none'`
      );
      await runNxCommandAsync(
        `generate @nxext/svelte:component test --project=${plugin}`
      );

      const result = await runNxCommandAsync(`test ${plugin}`);
      expect(`${result.stdout}${result.stderr}`).toContain('1 passed');
    });
  });

  describe('Svelte app', () => {
    it('should build svelte application with dependencies', async () => {
      const appName = uniq('svelte');
      await runNxCommandAsync(
        `generate @nxext/svelte:app ${appName} --e2eTestRunner='none' --unitTestRunner='none'`
      );
      const libName = uniq('sveltelib');
      await runNxCommandAsync(
        `generate @nxext/svelte:lib ${libName} --e2eTestRunner='none' --unitTestRunner='none'`
      );
      await runNxCommandAsync(
        `generate @nxext/svelte:c testcomp --project=${libName}`
      );
      updateFile(
        `apps/${appName}/src/App.svelte`,
        `
<script lang="ts">
  export let name: string;
  import { Testcomp } from '@proj/${libName}';
</script>

<main>
  <h1>Welcome {name}!</h1>
  <p>Visit the <a href="https://svelte.dev/tutorial">Svelte tutorial</a> to learn how to build Svelte apps.</p>
  <Testcomp />
</main>

<style>
main {
  text-align: center;
  padding: 1em;
  max-width: 240px;
  margin: 0 auto;
}

h1 {
  color: #ff3e00;
  text-transform: uppercase;
  font-size: 4em;
  font-weight: 100;
}

@media (min-width: 640px) {
  main {
    max-width: none;
  }
}
</style>
`
      );

      const result = await runNxCommandAsync(`build ${appName}`);
      expect(result.stdout).toContain('Bundle complete');

      expect(() =>
        checkFilesExist(`dist/apps/${appName}/index.html`)
      ).not.toThrow();
    });
  });
});
