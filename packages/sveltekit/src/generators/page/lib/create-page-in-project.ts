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

  const targetPath = options.targetPath || 'routes';

  const shouldWriteLayout = options.layout;
  const shouldWriteLoader = options.loader;

  generateFiles(
    tree,
    joinPathFragments(__dirname, '../files/src/routes'),
    joinPathFragments(
      `${projectConfig.sourceRoot}/${projectDirectory}/${targetPath}`
    ),
    names(options.name)
  );

  if (shouldWriteLayout) {
    generateFiles(
      tree,
      joinPathFragments(__dirname, '../files/src/layout'),
      joinPathFragments(
        `${projectConfig.sourceRoot}/${projectDirectory}/${targetPath}`
      ),
      names(options.name)
    );
  }

  if (shouldWriteLoader) {
    const shouldWriteErrorPage = options.error;

    if (shouldWriteErrorPage) {
      generateFiles(
        tree,
        joinPathFragments(__dirname, '../files/src/error'),
        joinPathFragments(
          `${projectConfig.sourceRoot}/${projectDirectory}/${targetPath}`
        ),
        names(options.name)
      );
    }

    generateFiles(
      tree,
      joinPathFragments(__dirname, '../files/src/loader'),
      joinPathFragments(
        `${projectConfig.sourceRoot}/${projectDirectory}/${targetPath}`
      ),
      names(options.name)
    );
  }
}
