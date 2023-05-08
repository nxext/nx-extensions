import { Tree, ensurePackage, NX_VERSION } from '@nx/devkit';
import { NormalizedSchema } from '../schema';

export async function addCypress(host: Tree, options: NormalizedSchema) {
  if (options.e2eTestRunner !== 'cypress') {
    return () => {}; // eslint-disable-line @typescript-eslint/no-empty-function
  }
  await ensurePackage('@nx/cypress', NX_VERSION);
  const { cypressProjectGenerator } = await import('@nx/cypress');

  return await cypressProjectGenerator(host, {
    name: options.name + '-e2e',
    project: options.name,
  });
}
