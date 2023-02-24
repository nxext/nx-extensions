/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  getProjects,
  offsetFromRoot,
  ProjectConfiguration,
  Tree,
  updateProjectConfiguration,
  addDependenciesToPackageJson,
  readJson,
  names,
} from '@nrwl/devkit';
import { mergeViteSourceFiles } from 'ast-vite-config-merge';
import { join } from 'path';
import {
  nxVersion,
  viteVersion,
  vitePluginEslintVersion,
  viteTsConfigPathsVersion,
  jsdomVersion,
  vitePluginReactVersion,
  vitePluginDtsVersion,
} from '@nrwl/vite/src/utils/versions';
import { createSourceFile, ScriptTarget, SourceFile } from 'typescript';

export default async function update(host: Tree) {
  const projects = getProjects(host);

  for (const [projectName, project] of projects) {
    let hasChanged = false;
    for (const [key, config] of Object.entries(project.targets)) {
      if (config.executor === '@nxext/vite:package') {
        const configsToMerge: SourceFile[] = [];
        const nxextPlusNxConfig = vitePackageNxPlusNxextBase(
          project.name,
          project,
          config.options?.entryFile
        );
        const originalUserConfigFile = getSourceFileForOption(
          host,
          project.root,
          config.options?.configFile,
          '@nxext/vite/plugins/vite-package'
        );
        const originalFrameworkConfigFile = getSourceFileForOption(
          host,
          project.root,
          config.options?.frameworkConfigFile,
          '@nxext/vite/plugins/vite-package'
        );

        const userConfig = getConfigPath(project, host);

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
            'nxext-plus-nx-config',
            nxextPlusNxConfig,
            ScriptTarget.ES2022
          )
        );

        // remove additional options designed for the original vite plugin by nxext
        delete config.options?.configFile;
        delete config.options?.frameworkConfigFile;
        delete config.options?.entryFile;

        // lets add the missing new config
        config.defaultConfiguration = 'production';
        config.configurations = {
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
            join(project.root, 'vite.config.ts'),
            mergeConfigs(configsToMerge).getFullText()
          );
        }
        hasChanged = true;
      } else if (config.executor === '@nxext/vite:build') {
        const configsToMerge: SourceFile[] = [];
        const nxextPlusNxConfig = viteProjectBase(project);
        const originalUserConfigFile = getSourceFileForOption(
          host,
          project.root,
          config.options?.configFile,
          '@nxext/vite/plugins/vite'
        );
        const originalFrameworkConfigFile = getSourceFileForOption(
          host,
          project.root,
          config.options?.frameworkConfigFile,
          '@nxext/vite/plugins/vite'
        );

        const userConfig = getConfigPath(project, host);

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
            'nxext-plus-nx-config',
            nxextPlusNxConfig,
            ScriptTarget.ES2022
          )
        );

        // remove additional options designed for the original vite plugin by nxext
        delete config.options?.configFile;
        delete config.options?.frameworkConfigFile;
        delete config.options?.entryFile;

        // lets add the missing new config
        config.configurations = {
          development: {
            extractLicenses: false,
            optimization: false,
            sourceMap: true,
            vendorChunk: true,
          },
          production: {
            fileReplacements: [
              {
                replace: `"apps/${project.name}/src/environments/environment.ts"`,
                with: `"apps/${project.name}/src/environments/environment.prod.ts"`,
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
            join(project.root, 'vite.config.ts'),
            mergeConfigs(configsToMerge).getFullText()
          );
        }
        hasChanged = true;
      } else if (config.executor === '@nxext/vite:dev') {
        const configsToMerge: SourceFile[] = [];
        const nxextPlusNxConfig = viteProjectBase(project);
        const originalUserConfigFile = getSourceFileForOption(
          host,
          project.root,
          config.options?.configFile,
          '@nxext/vite/plugins/vite'
        );
        const originalFrameworkConfigFile = getSourceFileForOption(
          host,
          project.root,
          config.options?.frameworkConfigFile,
          '@nxext/vite/plugins/vite'
        );

        const userConfig = getConfigPath(project, host);

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
            'nxext-plus-nx-config',
            nxextPlusNxConfig,
            ScriptTarget.ES2022
          )
        );

        // remove additional options designed for the original vite plugin by nxext
        delete config.options?.configFile;
        delete config.options?.frameworkConfigFile;
        delete config.options?.entryFile;

        // lets add the missing new config
        config.options = { ...(config.options ?? {}), hmr: true };
        config.configurations = {
          development: {
            buildTarget: `"${project.name}:build:development"`,
          },
          production: {
            buildTarget: `"${project.name}:build:production"`,
            hmr: false,
          },
        };
        if (userConfig) {
          host.write(userConfig, mergeConfigs(configsToMerge).getFullText());
        } else {
          host.write(
            join(project.root, 'vite.config.ts'),
            mergeConfigs(configsToMerge).getFullText()
          );
        }
        hasChanged = true;
      }
      return;
    }

    if (hasChanged) {
      project.targets = {
        ...project.targets,
        preview: {
          executor: '@nrwl/vite:preview-server',
          defaultConfiguration: 'development',
          options: {
            buildTarget: `"${project.name}:build"`,
          },
          configurations: {
            development: {
              buildTarget: `"${project.name}:build:development"`,
            },
            production: {
              buildTarget: `"${project.name}:build:production"`,
            },
          },
        },
      };

      updateProjectConfiguration(host, projectName, project);
    }
  }
  return checkDependenciesInstalled(host);
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

function checkDependenciesInstalled(host: Tree) {
  const packageJson = readJson(host, 'package.json');
  const devDependencies = {};
  const dependencies = {};
  packageJson.dependencies = packageJson.dependencies || {};
  packageJson.devDependencies = packageJson.devDependencies || {};

  // base deps
  devDependencies['@nrwl/vite'] = nxVersion;
  devDependencies['vite'] = viteVersion;
  devDependencies['vite-plugin-eslint'] = vitePluginEslintVersion;
  devDependencies['vite-tsconfig-paths'] = viteTsConfigPathsVersion;
  devDependencies['jsdom'] = jsdomVersion;

  devDependencies['vite-plugin-dts'] = vitePluginDtsVersion;

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
