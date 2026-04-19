import { NormalizedSchema } from '../schema';
import { Tree } from '@nx/devkit';

const JEST_CONFIG_EXTENSIONS = ['ts', 'cts', 'js', 'cjs'] as const;

export function updateJestConfig(host: Tree, options: NormalizedSchema) {
  if (options.unitTestRunner !== 'jest') {
    return;
  }

  const jestConfigPath = JEST_CONFIG_EXTENSIONS.map(
    (ext) => `${options.projectRoot}/jest.config.${ext}`
  ).find((path) => host.exists(path));

  if (!jestConfigPath) {
    return;
  }

  const svelteConfigPath = `${options.projectRoot}/svelte.config.cjs`;
  const originalContent = host.read(jestConfigPath).toString();
  const content = updateJestConfigContent(originalContent, svelteConfigPath);
  host.write(jestConfigPath, content);
}

function updateJestConfigContent(content: string, svelteConfigPath: string) {
  return content
    .replace('moduleFileExtensions: [', "moduleFileExtensions: ['svelte', ")
    .replace(
      'transform: {',
      `transform: {\n    '^(.+\\\\.svelte$)': ['svelte-jester', {\n      'preprocess': '${svelteConfigPath}'\n    }\n    ],`
    );
}
