import { NormalizedSchema } from '../schema';
import { Tree } from '@nx/devkit';

export function updateJestConfig(host: Tree, options: NormalizedSchema) {
  if (options.unitTestRunner !== 'jest') {
    return;
  }

  const jestConfigPath = `${options.projectRoot}/jest.config.ts`;
  // const svelteConfigPath = `${options.projectRoot}/jest.config.ts`;
  const originalContent = host.read(jestConfigPath)?.toString();
  const content = updateJestConfigContent(originalContent);
  host.write(jestConfigPath, content);
}

function updateJestConfigContent(content: string) {
  return content;
}
