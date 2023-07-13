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
  const shouldWriteClientLoader = options.clientLoader;
  const shouldWriteServerLoader = options.serverLoader;
  const shouldWriteErrorPage = options.error;
  const shouldWriteServerAPI = options.api;

  // layout includes page file
  if (shouldWritePage && shouldWriteLayout) {
    shouldWritePage = false;
  }

  const routesFolder = `${projectConfig.sourceRoot}/${projectDirectory}/routes`;
  const destinationFolder = targetPath
    ? `${routesFolder}/${targetPath}`
    : routesFolder;

  if (shouldWriteServerAPI) {
    generateFiles(
      tree,
      joinPathFragments(__dirname, '../files/src/server/api'),
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

  if (shouldWriteClientLoader) {
    generateFiles(
      tree,
      joinPathFragments(__dirname, '../files/src/client'),
      joinPathFragments(destinationFolder),
      names(options.name)
    );
  }

  if (shouldWriteServerLoader) {
    generateFiles(
      tree,
      joinPathFragments(__dirname, '../files/src/server/loader'),
      joinPathFragments(destinationFolder),
      names(options.name)
    );
  }
}
