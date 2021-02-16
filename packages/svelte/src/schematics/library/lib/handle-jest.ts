import { NormalizedSchema } from '../schema';
import { Tree } from '@angular-devkit/schematics';

export function handleJest(options: NormalizedSchema) {
  return (tree: Tree) => {
    if (options.unitTestRunner !== 'jest') {
      tree.delete(`${options.projectRoot}/jest.config.js`);
      tree.delete(`${options.projectRoot}/tsconfig.spec.json`);
    }
  };
}
