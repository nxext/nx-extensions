import { NormalizedSchema } from '../schema';
import { Tree } from '@nx/devkit';

export function updateJestConfig(host: Tree, options: NormalizedSchema) {
  if (options.unitTestRunner !== 'jest') {
    return;
  }

  const configPath = `${options.projectRoot}/jest.config.ts`;
  const svelteConfigPath = `${options.projectRoot}/svelte.config.cjs`;
  const originalContent = host.read(configPath)?.toString();
  const content = updateJestConfigContent(originalContent, svelteConfigPath);
  host.write(configPath, content);
}

function updateJestConfigContent(content: string, svelteConfigPath: string) {
  return content
    .replace('moduleFileExtensions: [', "moduleFileExtensions: ['svelte', ")
    .replace(
      'transform: {',
      `transform: {\n    '^(.+\\\\.svelte$)': ['svelte-jester', {\n      'preprocess': '${svelteConfigPath}'\n    }\n    ],`
    );
}
