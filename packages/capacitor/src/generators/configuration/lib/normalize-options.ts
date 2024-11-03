import {
  joinPathFragments,
  offsetFromRoot,
  readProjectConfiguration,
  Tree,
} from '@nx/devkit';
import { CapacitorConfigurationSchema, NormalizedSchema } from '../schema';

export function normalizeOptions(
  host: Tree,
  options: CapacitorConfigurationSchema
): NormalizedSchema {
  const appName = options.appName ? options.appName : options.project;
  const {
    root,
    targets: {
      build: {
        executor,
        options: { outputPath, browser },
      },
    },
  } = readProjectConfiguration(host, options.project);

  const esbuildBrowser =
    [
      '@angular-devkit/build-angular:application',
      '@nx/angular:application',
      '@angular-devkit/build-angular:browser-esbuild',
      '@nx/angular:browser-esbuild',
    ].includes(executor) && browser;

  const webDir = options.webDir
    ? options.webDir
    : joinPathFragments(`${outputPath}${esbuildBrowser ? '/browser' : ''}`);

  return {
    ...options,
    appName,
    webDir,
    projectRoot: root,
    pathToRoot: offsetFromRoot(root),
  };
}
