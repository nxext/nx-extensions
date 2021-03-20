import { NormalizedSchema } from '../schema';
import { Tree } from '@nrwl/devkit';

export function updateJestConfig(host: Tree, options: NormalizedSchema) {
  if (options.unitTestRunner !== 'jest') {
    return;
  }

  const jestConfigPath = `${options.projectRoot}/jest.config.js`;
  const svelteConfigPath = `${options.projectRoot}/jest.config.js`;
  const originalContent = host.read(jestConfigPath).toString();
  const content = updateJestConfigContent(originalContent, svelteConfigPath);
  host.write(jestConfigPath, content);
}

function updateJestConfigContent(content: string, svelteConfigPath: string) {
  return content
    .replace('moduleFileExtensions: [', "moduleFileExtensions: ['svelte', ")
    .replace(
      'transform: {',
      `transform: {\n    '^(.+\\\\.svelte$)': ['svelte-jester', {\n      'preprocess': '${svelteConfigPath}/svelte.config.js'\n    }\n    ],`
    );
}
