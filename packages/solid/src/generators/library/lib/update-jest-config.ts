import { NormalizedSchema } from '../schema';
import { Tree } from '@nrwl/devkit';

export function updateJestConfig(host: Tree, options: NormalizedSchema) {
  if (options.unitTestRunner !== 'jest') {
    return;
  }

  const configPath = `${options.projectRoot}/jest.config.js`;
  const originalContent = host.read(configPath).toString();
  const content = updateJestConfigContent(originalContent);
  host.write(configPath, content);
}

function updateJestConfigContent(content: string) {
  return content;
}
