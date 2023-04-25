import { Tree, writeJson } from '@nx/devkit';

export function createTsConfig(
  host: Tree,
  projectRoot: string,
  type: 'app' | 'lib',
  options: {
    strict?: boolean;
    bundler?: string;
    rootProject?: boolean;
    unitTestRunner?: string;
  },
  relativePathToRootTsConfig: string
) {
  const json = {
    compilerOptions: {
      allowJs: true,
      esModuleInterop: false,
      allowSyntheticDefaultImports: true,
      strict: options.strict,
    },
    files: [],
    include: [],
    references: [
      {
        path: type === 'app' ? './tsconfig.app.json' : './tsconfig.lib.json',
      },
    ],
  } as any;

  json.compilerOptions.types =
    options.unitTestRunner === 'vitest'
      ? ['vite/client', 'vitest']
      : ['vite/client'];
  json.extends = relativePathToRootTsConfig;

  writeJson(host, `${projectRoot}/tsconfig.json`, json);
}
