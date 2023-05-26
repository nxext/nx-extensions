import {
  convertNxGenerator,
  ensurePackage,
  formatFiles,
  generateFiles,
  getWorkspaceLayout,
  names,
  NX_VERSION,
  offsetFromRoot,
  Tree,
} from '@nx/devkit';
import * as path from 'path';
import { updateAppRoutingModule } from './lib/update-routing-file';
import { NormalizedSchema, PageGeneratorSchema } from './schema';

async function normalizeOptions(
  tree: Tree,
  options: PageGeneratorSchema
): Promise<NormalizedSchema> {
  ensurePackage('@nx/js', NX_VERSION);
  const { getNpmScope } = await import(
    '@nx/js/src/utils/package-json/get-npm-scope'
  );
  const { appsDir } = getWorkspaceLayout(tree);
  const projectRoot = `${appsDir}/${options.project}`;
  const npmScope = getNpmScope(tree);

  return {
    ...options,
    projectRoot,
    prefix: npmScope,
  };
}

function addFiles(tree: Tree, options: NormalizedSchema) {
  const templateOptions = {
    ...options,
    ...names(options.name),
    name: names(options.name).fileName,
    offsetFromRoot: offsetFromRoot(options.projectRoot),
    template: '',
  };

  const pageDir = options.directory
    ? path.join(
        options.projectRoot,
        `/src/app/${options.directory}/${names(options.name).fileName}`
      )
    : path.join(
        options.projectRoot,
        `/src/app/${names(options.name).fileName}`
      );

  generateFiles(tree, path.join(__dirname, 'files'), pageDir, templateOptions);
}

export async function pageGenerator(tree: Tree, options: PageGeneratorSchema) {
  const normalizedOptions = await normalizeOptions(tree, options);
  addFiles(tree, normalizedOptions);
  updateAppRoutingModule(tree, normalizedOptions);

  await formatFiles(tree);
}

export default pageGenerator;
export const pageSchematic = convertNxGenerator(pageGenerator);
