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

  const originalContent = host.read(jestConfigPath).toString();
  host.write(jestConfigPath, updateJestConfigContent(originalContent));
}

function updateJestConfigContent(content: string) {
  // svelte-jester's `preprocess` option is passed to `require()` at transform
  // time. A relative string resolves against `node_modules/svelte-jester`, not
  // the project, so the require fails. Emit a runtime expression that
  // resolves the path against `__dirname` (the jest config's directory) so
  // svelte-jester receives an absolute path.
  return content
    .replace('moduleFileExtensions: [', "moduleFileExtensions: ['svelte', ")
    .replace(
      'transform: {',
      `transform: {\n    '^(.+\\\\.svelte$)': ['svelte-jester', {\n      preprocess: require('path').resolve(__dirname, 'svelte.config.cjs')\n    }],`
    );
}
