import { Tree } from 'nx/src/generators/tree';
import * as shared from '@nx/js';
import { updateJson, writeJson } from 'nx/src/generators/utils/json';

export function createTsConfig(
  host: Tree,
  projectRoot: string,
  type: 'app' | 'lib',
  options: {
    strict?: boolean;
    style?: string;
    bundler?: string;
    rootProject?: boolean;
    unitTestRunner?: string;
    isUsingTsSolutionConfig?: boolean;
  },
  relativePathToRootTsConfig: string,
) {
  const json = {
    files: [],
    include: [],
    references: [
      {
        path: type === 'app' ? './tsconfig.app.json' : './tsconfig.lib.json',
      },
    ],
  } as any;

  // In TS-solution mode the per-project wrapper tsconfig.json is meant to
  // stay a thin "references" pointer (mirrors @nx/react/@nx/js's
  // `createTsConfigForTsSolution`): no framework compilerOptions get baked
  // in here, since the root tsconfig.base.json (which already exists in a
  // TS-solution workspace) is the single source of truth for those, and the
  // framework-specific overrides that DO need to differ per project
  // (moduleResolution: 'bundler' etc.) are applied directly onto the
  // runtime tsconfig.app.json/tsconfig.lib.json by `wireTsSolutionProject`
  // instead (see application.ts/library.ts).
  if (!options.isUsingTsSolutionConfig) {
    json.compilerOptions = {
      allowJs: false,
      esModuleInterop: false,
      allowSyntheticDefaultImports: true,
      strict: options.strict,
    };

    if (options.bundler === 'vite') {
      json.compilerOptions.types =
        options.unitTestRunner === 'vitest'
          ? ['vite/client', 'vitest']
          : ['vite/client'];
    }
  }

  // inline tsconfig.base.json into the project
  if (options.rootProject) {
    json.compileOnSave = false;
    json.compilerOptions = {
      ...shared.tsConfigBaseOptions,
      ...json.compilerOptions,
    };
    json.exclude = ['node_modules', 'tmp'];
  } else {
    json.extends = relativePathToRootTsConfig;
  }

  writeJson(host, `${projectRoot}/tsconfig.json`, json);

  const tsconfigProjectPath = `${projectRoot}/tsconfig.${type}.json`;
  if (options.bundler === 'vite' && host.exists(tsconfigProjectPath)) {
    updateJson(host, tsconfigProjectPath, (json) => {
      json.compilerOptions ??= {};

      const types = new Set(json.compilerOptions.types ?? []);
      types.add('node');
      types.add('vite/client');

      json.compilerOptions.types = Array.from(types);

      return json;
    });
  }
}

export function extractTsConfigBase(host: Tree) {
  shared.extractTsConfigBase(host);

  if (host.exists('vite.config.ts')) {
    const vite = host.read('vite.config.ts').toString();
    host.write(
      'vite.config.ts',
      vite.replace(`projects: []`, `projects: ['tsconfig.base.json']`),
    );
  }
}
