/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  offsetFromRoot,
  ProjectConfiguration,
  Tree,
  updateProjectConfiguration,
  addDependenciesToPackageJson,
  readJson,
  names,
  ensurePackage,
  readProjectConfiguration,
} from '@nrwl/devkit';
import { mergeViteSourceFiles } from 'ast-vite-config-merge';
import { join } from 'path';
import { createSourceFile, ScriptTarget, SourceFile } from 'typescript';
import { forEachExecutorOptions, readNxVersion } from './utils';
import { BuildExecutorSchema } from '../../executors/build/schema';
import { DevExecutorSchema } from '../../executors/dev/schema';
import { Schema } from '../../executors/package/schema';

function migrateVitePackage(
  host: Tree,
  projectName: string,
  targetName: string
) {
  const projectConfiguration = readProjectConfiguration(host, projectName);
  const targetConfiguration = projectConfiguration.targets[targetName];
  targetConfiguration.executor = '@nrwl/vite:build';

  const configsToMerge: SourceFile[] = [];
  const nxextPlusNxConfig = vitePackageNxPlusNxextBase(
    projectConfiguration.name,
    projectConfiguration,
    targetConfiguration.options?.entryFile
  );
  const originalUserConfigFile = getSourceFileForOption(
    host,
    projectConfiguration.root,
    targetConfiguration.options?.configFile,
    '@nxext/vite/plugins/vite-package'
  );
  const originalFrameworkConfigFile = getSourceFileForOption(
    host,
    projectConfiguration.root,
    targetConfiguration.options?.frameworkConfigFile,
    '@nxext/vite/plugins/vite-package'
  );

  const userConfig = getConfigPath(projectConfiguration, host);

  if (originalFrameworkConfigFile) {
    configsToMerge.push(originalFrameworkConfigFile);
  }
  if (originalUserConfigFile) {
    configsToMerge.push(originalUserConfigFile);
  }
  if (userConfig) {
    configsToMerge.push(
      createSourceFile(
        userConfig,
        host.read(userConfig, 'utf-8'),
        ScriptTarget.ES2022
      )
    );
  }
  configsToMerge.push(
    createSourceFile(
      'nxext-plus-nx-targetConfiguration',
      nxextPlusNxConfig,
      ScriptTarget.ES2022
    )
  );

  // remove additional options designed for the original vite plugin by nxext
  delete targetConfiguration.options?.configFile;
  delete targetConfiguration.options?.frameworkConfigFile;
  delete targetConfiguration.options?.entryFile;

  // lets add the missing new targetConfiguration
  targetConfiguration.defaultConfiguration = 'production';
  targetConfiguration.configurations = {
    development: {
      mode: 'development',
    },
    production: {
      mode: 'production',
    },
  };

  if (userConfig) {
    host.write(userConfig, mergeConfigs(configsToMerge).getFullText());
  } else {
    host.write(
      join(projectConfiguration.root, 'vite.targetConfiguration.ts'),
      mergeConfigs(configsToMerge).getFullText()
    );
  }

  updateProjectConfiguration(host, projectName, projectConfiguration);
}

function migrateViteBuild(host: Tree, projectName: string, targetName: string) {
  const projectConfiguration = readProjectConfiguration(host, projectName);
  const targetConfiguration = projectConfiguration.targets[targetName];
  targetConfiguration.executor = '@nrwl/vite:build';
  const configsToMerge: SourceFile[] = [];
  const nxextPlusNxConfig = viteProjectBase(projectConfiguration);
  const originalUserConfigFile = getSourceFileForOption(
    host,
    projectConfiguration.root,
    targetConfiguration.options?.configFile,
    '@nxext/vite/plugins/vite'
  );
  const originalFrameworkConfigFile = getSourceFileForOption(
    host,
    projectConfiguration.root,
    targetConfiguration.options?.frameworkConfigFile,
    '@nxext/vite/plugins/vite'
  );

  const userConfig = getConfigPath(projectConfiguration, host);

  if (originalFrameworkConfigFile) {
    configsToMerge.push(originalFrameworkConfigFile);
  }
  if (originalUserConfigFile) {
    configsToMerge.push(originalUserConfigFile);
  }
  if (userConfig) {
    configsToMerge.push(
      createSourceFile(
        userConfig,
        host.read(userConfig, 'utf-8'),
        ScriptTarget.ES2022
      )
    );
  }
  configsToMerge.push(
    createSourceFile(
      'nxext-plus-nx-targetConfiguration',
      nxextPlusNxConfig,
      ScriptTarget.ES2022
    )
  );

  // remove additional options designed for the original vite plugin by nxext
  delete targetConfiguration.options?.configFile;
  delete targetConfiguration.options?.frameworkConfigFile;
  delete targetConfiguration.options?.entryFile;

  // lets add the missing new targetConfiguration
  targetConfiguration.configurations = {
    development: {
      extractLicenses: false,
      optimization: false,
      sourceMap: true,
      vendorChunk: true,
    },
    production: {
      fileReplacements: [
        {
          replace: `"apps/${projectConfiguration.name}/src/environments/environment.ts"`,
          with: `"apps/${projectConfiguration.name}/src/environments/environment.prod.ts"`,
        },
      ],
      optimization: true,
      outputHashing: 'all',
      sourceMap: false,
      namedChunks: false,
      extractLicenses: true,
      vendorChunk: false,
    },
  };

  if (userConfig) {
    host.write(userConfig, mergeConfigs(configsToMerge).getFullText());
  } else {
    host.write(
      join(projectConfiguration.root, 'vite.targetConfiguration.ts'),
      mergeConfigs(configsToMerge).getFullText()
    );
  }

  projectConfiguration.targets[targetName] = targetConfiguration;

  projectConfiguration.targets = {
    ...projectConfiguration.targets,
    preview: {
      executor: '@nrwl/vite:preview-server',
      defaultConfiguration: 'development',
      options: {
        buildTarget: `"${projectName}:build"`,
      },
      configurations: {
        development: {
          buildTarget: `"${projectName}:build:development"`,
        },
        production: {
          buildTarget: `"${projectName}:build:production"`,
        },
      },
    },
  };

  updateProjectConfiguration(host, projectName, projectConfiguration);
}

function migrateViteDev(host: Tree, projectName: string, targetName: string) {
  const projectConfiguration = readProjectConfiguration(host, projectName);
  const targetConfiguration = projectConfiguration.targets[targetName];
  targetConfiguration.executor = '@nrwl/vite:dev-server';
  const configsToMerge: SourceFile[] = [];
  const nxextPlusNxConfig = viteProjectBase(projectConfiguration);
  const originalUserConfigFile = getSourceFileForOption(
    host,
    projectConfiguration.root,
    targetConfiguration.options?.configFile,
    '@nxext/vite/plugins/vite'
  );
  const originalFrameworkConfigFile = getSourceFileForOption(
    host,
    projectConfiguration.root,
    targetConfiguration.options?.frameworkConfigFile,
    '@nxext/vite/plugins/vite'
  );

  const userConfig = getConfigPath(projectConfiguration, host);

  if (originalFrameworkConfigFile) {
    configsToMerge.push(originalFrameworkConfigFile);
  }
  if (originalUserConfigFile) {
    configsToMerge.push(originalUserConfigFile);
  }
  if (userConfig) {
    configsToMerge.push(
      createSourceFile(
        userConfig,
        host.read(userConfig, 'utf-8'),
        ScriptTarget.ES2022
      )
    );
  }
  configsToMerge.push(
    createSourceFile(
      'nxext-plus-nx-targetConfiguration',
      nxextPlusNxConfig,
      ScriptTarget.ES2022
    )
  );

  // remove additional options designed for the original vite plugin by nxext
  delete targetConfiguration.options?.configFile;
  delete targetConfiguration.options?.frameworkConfigFile;
  delete targetConfiguration.options?.entryFile;

  // lets add the missing new targetConfiguration
  targetConfiguration.options = {
    ...(targetConfiguration.options ?? {}),
    hmr: true,
    buildTarget: `${projectConfiguration.name}:build`,
  };
  targetConfiguration.configurations = {
    development: {
      buildTarget: `${projectConfiguration.name}:build:development`,
    },
    production: {
      buildTarget: `${projectConfiguration.name}:build:production`,
      hmr: false,
    },
  };

  if (userConfig) {
    host.write(userConfig, mergeConfigs(configsToMerge).getFullText());
  } else {
    host.write(
      join(projectConfiguration.root, 'vite.targetConfiguration.ts'),
      mergeConfigs(configsToMerge).getFullText()
    );
  }

  projectConfiguration.targets[targetName] = targetConfiguration;
  updateProjectConfiguration(host, projectName, projectConfiguration);
}

export default async function update(host: Tree) {
  forEachExecutorOptions<BuildExecutorSchema>(
    host,
    '@nxext/vite:build',
    (options, projectName, targetName, configurationName) => {
      migrateViteBuild(host, projectName, targetName);
    }
  );

  forEachExecutorOptions<DevExecutorSchema>(
    host,
    '@nxext/vite:dev',
    (options, projectName, targetName, configurationName) => {
      migrateViteDev(host, projectName, targetName);
    }
  );

  forEachExecutorOptions<Schema>(
    host,
    '@nxext/vite:package',
    (options, projectName, targetName, configurationName) => {
      migrateVitePackage(host, projectName, targetName);
    }
  );

  return await checkDependenciesInstalled(host);
}

function mergeConfigs(configs: SourceFile[]): SourceFile {
  if (configs.length === 1) {
    return configs[0];
  } else {
    const first = configs.shift();
    return configs.reduce(
      (prev, curr) => mergeViteSourceFiles(prev, curr),
      first
    );
  }
}

function getConfigPath(
  project: ProjectConfiguration,
  host: Tree
): string | null {
  const viteConfigJsPath = join(project.root, 'vite.config.js');
  const viteConfigTsPath = join(project.root, 'vite.config.ts');

  if (host.exists(viteConfigJsPath)) {
    return viteConfigJsPath;
  } else if (host.exists(viteConfigTsPath)) {
    return viteConfigTsPath;
  }

  return null;
}

async function checkDependenciesInstalled(host: Tree) {
  const packageJson = readJson(host, 'package.json');
  const devDependencies = {};
  const dependencies = {};
  packageJson.dependencies = packageJson.dependencies || {};
  packageJson.devDependencies = packageJson.devDependencies || {};

  await ensurePackage(host, '@nrwl/vite', readNxVersion(host));

  // base deps
  devDependencies['@nrwl/vite'] = readNxVersion(host);
  devDependencies['vite'] = '^4.0.1';
  devDependencies['vite-plugin-eslint'] = '^1.8.1';
  devDependencies['vite-tsconfig-paths'] = '^4.0.2';
  devDependencies['jsdom'] = '~20.0.3';

  devDependencies['vite-plugin-dts'] = '~1.7.1';

  return addDependenciesToPackageJson(host, dependencies, devDependencies);
}

function getSourceFileForOption(
  host: Tree,
  projectRoot: string,
  config: string,
  basePackage?: string
): SourceFile | undefined {
  if (config && config !== basePackage) {
    if (host.exists(config)) {
      return createSourceFile(
        config,
        host.read(config, 'utf8'),
        ScriptTarget.ES2022
      );
    } else {
      const offsetValue = offsetFromRoot(projectRoot);
      return createSourceFile(
        `${offsetValue}/node_modules/${config}`,
        host.read(`${offsetValue}/node_modules/${config}`, 'utf8'),
        ScriptTarget.ES2022
      );
    }
  }
}

function viteProjectBase(project: ProjectConfiguration) {
  return `
  /// <reference types="vitest" />
  import { defineConfig } from 'vite';
  import react from '@vitejs/plugin-react';
  import viteTsConfigPaths from 'vite-tsconfig-paths';

  export default defineConfig({
    cacheDir: '${offsetFromRoot(project.root)}/node_modules/.vite/${
    project.name
  }',

    server: {
      port: 4200,
      host: 'localhost',
    },

    preview: {
      port: 4300,
      host: 'localhost',
    },

    plugins: [
      react(),
      viteTsConfigPaths({
        root: '${offsetFromRoot(project.root)}',
      }),
    ],

    // Uncomment this if you are using workers.
    // worker: {
    //  plugins: [
    //    viteTsConfigPaths({
    //      root: '${offsetFromRoot(project.root)}',
    //    }),
    //  ],
    // },
  });

  `;
}

function vitePackageNxPlusNxextBase(
  projectName: string,
  project: ProjectConfiguration,
  entryFile: string
) {
  return `
  import { defineConfig } from 'vite';
  import react from '@vitejs/plugin-react';
  import viteTsConfigPaths from 'vite-tsconfig-paths';
  import dts from 'vite-plugin-dts';
  import { join } from 'path';
  export default defineConfig({
    cacheDir: '${offsetFromRoot(
      project.root
    )}/node_modules/.vite/${projectName}',

    plugins: [
      dts({
        tsConfigFilePath: join(__dirname, 'tsconfig.lib.json'),
        // Faster builds by skipping tests. Set this to false to enable type checking.
        skipDiagnostics: true,
      }),
      react(),
      viteTsConfigPaths({
        root: '${offsetFromRoot(project.root)}',
      }),
    ],

    // Uncomment this if you are using workers.
    // worker: {
    //  plugins: [
    //    viteTsConfigPaths({
    //      root: '${offsetFromRoot(project.root)}',
    //    }),
    //  ],
    // },

    // Configuration for building your library.
    // See: https://vitejs.dev/guide/build.html#library-mode
    build: {
      lib: {
        // Could also be a dictionary or array of multiple entry points.
        entry: '${entryFile}',
        name: 'react-lib',
        fileName: (format) => \`${names(projectName).fileName}.\${format}.js\`,
        // Change this to the formats you want to support.
        // Don't forgot to update your package.json as well.
        formats: ['es', 'cjs'],
      },
    },
  })`;
}
