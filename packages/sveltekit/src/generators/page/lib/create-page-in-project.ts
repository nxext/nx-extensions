import {
  generateFiles,
  joinPathFragments,
  names,
  readProjectConfiguration,
  Tree,
} from '@nx/devkit';
import { SveltePageSchema } from '../page';

export function createPageInProject(tree: Tree, options: SveltePageSchema) {
  const projectConfig = readProjectConfiguration(tree, options.project);
  const projectDirectory = options.directory ?? '';

  const targetPath = options.targetPath;

  const shouldWriteLayout = options.layout;
  const shouldWriteDataLoader = options.data;
  const shouldWriteErrorPage = options.error;

  const routesFolder = `${projectConfig.sourceRoot}/${projectDirectory}/routes`;
  const destinationFolder = targetPath
    ? `${routesFolder}/${targetPath}`
    : routesFolder;

  if (shouldWriteLayout) {
    generateFiles(
      tree,
      joinPathFragments(__dirname, '../files/src/layout'),
      joinPathFragments(destinationFolder),
      names(options.name)
    );
  } else {
    generateFiles(
      tree,
      joinPathFragments(__dirname, '../files/src/plain'),
      joinPathFragments(destinationFolder),
      names(options.name)
    );
  }

  if (shouldWriteErrorPage) {
    generateFiles(
      tree,
      joinPathFragments(__dirname, '../files/src/error'),
      joinPathFragments(destinationFolder),
      names(options.name)
    );
  }

  if (shouldWriteDataLoader) {
    generateFiles(
      tree,
      joinPathFragments(__dirname, '../files/src/data'),
      joinPathFragments(destinationFolder),
      names(options.name)
    );
  }
}
