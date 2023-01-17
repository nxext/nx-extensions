import * as shared from '@nrwl/workspace/src/utils/create-ts-config';
import { Tree, writeJson } from '@nrwl/devkit';

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
      allowJs: false,
      esModuleInterop: false,
      allowSyntheticDefaultImports: true,
      strict: options.strict
    },
    files: [],
    include: [],
    references: [
      {
        path: type === 'app' ? './tsconfig.app.json' : './tsconfig.lib.json'
      }
    ]
  } as any;

  json.compilerOptions.types =
    options.unitTestRunner === 'vitest'
      ? ['vite/client', 'vitest']
      : ['vite/client'];
  json.extends = relativePathToRootTsConfig;

  writeJson(host, `${projectRoot}/tsconfig.json`, json);
}

export function extractTsConfigBase(host: Tree) {
  shared.extractTsConfigBase(host);

  if (host.exists('vite.config.ts')) {
    const vite = host.read('vite.config.ts').toString();
    host.write(
      'vite.config.ts',
      vite.replace(`projects: []`, `projects: ['tsconfig.base.json']`)
    );
  }
}
