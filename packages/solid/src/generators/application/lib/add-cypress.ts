import { ensurePackage, Tree } from '@nrwl/devkit';
import { NormalizedSchema } from '../schema';
import { readNxVersion } from '../../init/lib/util';

export async function addCypress(host: Tree, options: NormalizedSchema) {
  if (options.e2eTestRunner !== 'cypress') {
    return () => {}; // eslint-disable-line @typescript-eslint/no-empty-function
  }

  await ensurePackage(host, '@nrwl/cypress', readNxVersion(host));
  const { cypressProjectGenerator } = await import('@nrwl/cypress');

  return await cypressProjectGenerator(host, {
    ...options,
    name: options.e2eProjectName,
    directory: options.directory,
    project: options.projectName,
    rootProject: options.rootProject,
    bundler: 'vite',
  });
}
