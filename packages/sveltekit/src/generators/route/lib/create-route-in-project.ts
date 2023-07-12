import {
  generateFiles,
  joinPathFragments,
  names,
  readProjectConfiguration,
  Tree,
} from '@nx/devkit';
import { SvelteRouteSchema } from '../route';

export function createRouteInProject(tree: Tree, options: SvelteRouteSchema) {
  const projectConfig = readProjectConfiguration(tree, options.project);
  const projectDirectory = options.directory ?? '';

  options.methodList = (options.methods || '').split(',');

  const targetPath = options.targetPath;

  let shouldWritePage = options.page;
  const shouldWriteLayout = options.layout;
  const shouldWriteDataLoader = options.data;
  const shouldWriteErrorPage = options.error;
  const shouldWriteServer = options.server;

  // layout includes page file
  if (shouldWritePage && shouldWriteLayout) {
    shouldWritePage = false;
  }

  const routesFolder = `${projectConfig.sourceRoot}/${projectDirectory}/routes`;
  const destinationFolder = targetPath
    ? `${routesFolder}/${targetPath}`
    : routesFolder;

  if (shouldWriteServer) {
    generateFiles(
      tree,
      joinPathFragments(__dirname, '../files/src/server'),
      joinPathFragments(destinationFolder),
      names(options.name)
    );
  }

  if (shouldWritePage) {
    generateFiles(
      tree,
      joinPathFragments(__dirname, '../files/src/page'),
      joinPathFragments(destinationFolder),
      names(options.name)
    );
  }

  if (shouldWriteLayout) {
    generateFiles(
      tree,
      joinPathFragments(__dirname, '../files/src/layout'),
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
