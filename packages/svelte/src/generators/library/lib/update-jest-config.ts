import { NormalizedSchema } from '../schema';
import { Tree } from '@nx/devkit';

const JEST_CONFIG_EXTENSIONS = ['ts', 'cts', 'js', 'cjs'] as const;

export function updateJestConfig(host: Tree, options: NormalizedSchema) {
  if (options.unitTestRunner !== 'jest') {
    return;
  }

  const configPath = JEST_CONFIG_EXTENSIONS.map(
    (ext) => `${options.projectRoot}/jest.config.${ext}`
  ).find((path) => host.exists(path));

  if (!configPath) {
    return;
  }

  const originalContent = host.read(configPath).toString();
  host.write(configPath, updateJestConfigContent(originalContent));
}

function updateJestConfigContent(content: string) {
  // See application/lib/update-jest-config.ts for why the preprocess value is
  // emitted as a `require('path').resolve(...)` expression rather than a
  // literal string.
  return content
    .replace('moduleFileExtensions: [', "moduleFileExtensions: ['svelte', ")
    .replace(
      'transform: {',
      `transform: {\n    '^(.+\\\\.svelte$)': ['svelte-jester', {\n      preprocess: require('path').resolve(__dirname, 'svelte.config.cjs')\n    }],`
    );
}
