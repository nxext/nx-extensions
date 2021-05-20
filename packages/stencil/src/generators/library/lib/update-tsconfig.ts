import { NormalizedLibrarySchema } from '../schema';
import { Tree, updateJson } from '@nrwl/devkit';

export function updateTsConfig(host: Tree, options: NormalizedLibrarySchema) {
  updateJson(host, 'tsconfig.base.json', (json) => {
    const c = json.compilerOptions;
    delete c.paths[`${options.importPath}`];
    c.paths[`${options.importPath}`] = [
      `dist/${options.projectRoot}`
    ];
    return json;
  });
}
