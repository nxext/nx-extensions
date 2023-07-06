import { join, dirname } from 'path';
import { mkdirSync, rmSync } from 'fs';
import { execSync } from 'child_process';

export { runNxCommandUntil } from './run-commands-until';

/**
 * Creates a test project with create-nx-workspace and installs the plugin
 * @returns The directory where the test project was created
 */
export function createTestProject() {
  const projectName = 'proj';
  const projectDirectory = join(process.cwd(), 'tmp/nx-e2e', projectName);

  // Ensure projectDirectory is empty
  rmSync(projectDirectory, {
    recursive: true,
    force: true,
  });
  mkdirSync(dirname(projectDirectory), {
    recursive: true,
  });

  execSync(
    `npx --yes create-nx-workspace@latest ${projectName} --preset empty --no-nxCloud --no-interactive`,
    {
      cwd: dirname(projectDirectory),
      stdio: 'inherit',
      env: process.env,
    }
  );
  console.log(`Created test project in "${projectDirectory}"`);

  return projectDirectory;
}

export function installPlugin(projectDirectory: string, pluginName: string) {
  // The plugin has been built and published to a local registry in the jest globalSetup
  // Install the plugin built with the latest source code into the test repo
  execSync(`npm install @nxext/${pluginName}@e2e`, {
    cwd: projectDirectory,
    stdio: 'inherit',
    env: process.env,
  });
}
