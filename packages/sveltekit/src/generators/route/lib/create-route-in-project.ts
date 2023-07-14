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

  const shouldWritePage = options.page;
  const shouldWriteLayout = options.layout;
  const shouldWritePageClientLoader = options.pageClientLoader;
  const shouldWritePageServerLoader = options.pageServerLoader;
  const shouldWriteLayoutClientLoader = options.layoutClientLoader;
  const shouldWriteLayoutServerLoader = options.layoutServerLoader;
  const shouldWriteErrorPage = options.error;
  const shouldWriteServerAPI = options.api;

  const routesFolder = `${projectConfig.sourceRoot}/${projectDirectory}/routes`;
  const destinationFolder = targetPath
    ? `${routesFolder}/${targetPath}`
    : routesFolder;

  if (shouldWriteServerAPI) {
    generateFiles(
      tree,
      joinPathFragments(__dirname, '../files/src/api'),
      joinPathFragments(destinationFolder),
      names(options.name)
    );
  }

  if (shouldWritePage) {
    generateFiles(
      tree,
      joinPathFragments(__dirname, '../files/src/page/page'),
      joinPathFragments(destinationFolder),
      names(options.name)
    );
  }

  if (shouldWriteLayout) {
    generateFiles(
      tree,
      joinPathFragments(__dirname, '../files/src/layout/page'),
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

  if (shouldWritePageClientLoader) {
    generateFiles(
      tree,
      joinPathFragments(__dirname, '../files/src/page/client'),
      joinPathFragments(destinationFolder),
      names(options.name)
    );
  }

  if (shouldWritePageServerLoader) {
    generateFiles(
      tree,
      joinPathFragments(__dirname, '../files/src/page/server'),
      joinPathFragments(destinationFolder),
      names(options.name)
    );
  }

  if (shouldWriteLayoutClientLoader) {
    generateFiles(
      tree,
      joinPathFragments(__dirname, '../files/src/layout/client'),
      joinPathFragments(destinationFolder),
      names(options.name)
    );
  }

  if (shouldWriteLayoutServerLoader) {
    generateFiles(
      tree,
      joinPathFragments(__dirname, '../files/src/layout/server'),
      joinPathFragments(destinationFolder),
      names(options.name)
    );
  }
}
