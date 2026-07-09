import {
  addProjectConfiguration,
  ensurePackage,
  GeneratorCallback,
  joinPathFragments,
  NX_VERSION,
  Tree,
} from '@nx/devkit';

/**
 * Nur App (siehe Design 1.2 "(b)"). 1:1 aus solid/svelte (byte-identisch);
 * preact ist inhaltlich gleich, nutzt aber `options.name` statt
 * `options.projectName` und hardcodet `rootProject: false` statt
 * `options.rootProject` durchzureichen — beide Aufrufer-Anpassungen
 * bleiben Sache der jeweiligen Migration (siehe Design 1.2/2.3).
 */
export async function addCypressApplication(
  host: Tree,
  options: {
    projectName: string;
    e2eTestRunner: 'cypress' | 'none';
    e2eProjectName: string;
    e2eProjectRoot: string;
    e2eWebServerAddress: string;
    e2eWebServerTarget: string;
    rootProject?: boolean;
  },
): Promise<GeneratorCallback> {
  if (options.e2eTestRunner !== 'cypress') {
    return () => {}; // eslint-disable-line @typescript-eslint/no-empty-function
  }

  const { webStaticServeGenerator } = ensurePackage<typeof import('@nx/web')>(
    '@nx/web',
    NX_VERSION,
  );

  await webStaticServeGenerator(host, {
    buildTarget: `${options.projectName}:build`,
    targetName: 'serve-static',
    spa: true,
  });

  const { configurationGenerator } = ensurePackage<
    typeof import('@nx/cypress')
  >('@nx/cypress', NX_VERSION);

  addProjectConfiguration(host, options.e2eProjectName, {
    projectType: 'application',
    root: options.e2eProjectRoot,
    sourceRoot: joinPathFragments(options.e2eProjectRoot, 'src'),
    targets: {},
    implicitDependencies: [options.projectName],
    tags: [],
  });

  return await configurationGenerator(host, {
    ...options,
    project: options.e2eProjectName,
    directory: 'src',
    // the name and root are already normalized, instruct the generator to use them as is
    bundler: 'webpack',
    skipFormat: true,
    devServerTarget: `${options.projectName}:${options.e2eWebServerTarget}`,
    baseUrl: options.e2eWebServerAddress,
    jsx: true,
    rootProject: options.rootProject,
    webServerCommands: {
      default: `nx run ${options.projectName}:${options.e2eWebServerTarget}`,
      production: `nx run ${options.projectName}:preview`,
    },
    ciWebServerCommand: `nx run ${options.projectName}:serve-static`,
  });
}
