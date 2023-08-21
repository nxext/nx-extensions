import {
  addProjectConfiguration,
  ensurePackage,
  getPackageManagerCommand,
  joinPathFragments,
  NX_VERSION,
  Tree,
} from '@nx/devkit';
import { NormalizedSchema } from '../schema';

export async function addE2e(host: Tree, options: NormalizedSchema) {
  if (options.e2eTestRunner === 'cypress') {
    await ensurePackage('@nx/cypress', NX_VERSION);
    const { cypressProjectGenerator } = await import('@nx/cypress');
    return await cypressProjectGenerator(host, {
      ...options,
      name: options.e2eProjectName,
      directory: options.e2eProjectRoot,
      // the name and root are already normalized, instruct the generator to use them as is
      projectNameAndRootFormat: 'as-provided',
      project: options.appProjectName,
      bundler: 'vite',
      skipFormat: true,
    });
  }

  if (options.e2eTestRunner === 'playwright') {
    const { configurationGenerator } = ensurePackage<
      typeof import('@nx/playwright')
    >('@nx/playwright', NX_VERSION);
    addProjectConfiguration(host, options.e2eProjectName, {
      root: options.e2eProjectRoot,
      sourceRoot: joinPathFragments(options.e2eProjectRoot, 'src'),
      targets: {},
      implicitDependencies: [options.appProjectName],
    });
    return configurationGenerator(host, {
      project: options.e2eProjectName,
      skipFormat: true,
      skipPackageJson: false,
      directory: 'src',
      js: false,
      linter: options.linter,
      setParserOptionsProject: false,
      webServerCommand: `${getPackageManagerCommand().exec} nx serve ${
        options.name
      }`,
      webServerAddress: 'http://localhost:4200',
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  return () => {};
}
