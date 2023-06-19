import { ensurePackage, NX_VERSION, Tree } from '@nx/devkit';
import { InitSchema } from '../schema';

export async function addCypress(host: Tree, options: InitSchema) {
  if (options.e2eTestRunner !== 'cypress') {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    return () => {};
  }

  await ensurePackage('@nx/cypress', NX_VERSION);
  const generators = await import('@nx/cypress');
  return generators.cypressInitGenerator(host, {});
}
