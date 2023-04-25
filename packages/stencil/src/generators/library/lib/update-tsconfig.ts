import { LibrarySchema } from '../schema';
import { Tree, updateJson } from '@nx/devkit';

export function updateTsConfig(host: Tree, options: LibrarySchema) {
  updateJson(host, 'tsconfig.base.json', (json) => {
    const c = json.compilerOptions;
    delete c.paths[`${options.importPath}`];
    c.paths[`${options.importPath}`] = [`${options.projectRoot}/src/index.ts`];
    return json;
  });
}
