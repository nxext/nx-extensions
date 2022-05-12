import { joinPathFragments, Tree } from '@nrwl/devkit';
import { NormalizedSchema } from '../schema';

export function removePlainReactapp(host: Tree, options: NormalizedSchema) {
  host.delete(joinPathFragments(options.appProjectRoot, 'src/app'));
}
