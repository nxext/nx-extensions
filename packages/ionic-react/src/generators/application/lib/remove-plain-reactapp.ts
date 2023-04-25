import { joinPathFragments, Tree } from '@nx/devkit';
import { NormalizedSchema } from '../schema';

export function removePlainReactapp(host: Tree, options: NormalizedSchema) {
  host.delete(joinPathFragments(options.appProjectRoot, 'src/app'));
}
