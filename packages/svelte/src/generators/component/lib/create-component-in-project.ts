import {
  generateFiles,
  joinPathFragments,
  names,
  readProjectConfiguration,
  Tree,
} from '@nx/devkit';
import { SvelteComponentSchema } from '../component';

export function createComponentInProject(
  tree: Tree,
  options: SvelteComponentSchema
) {
  const projectConfig = readProjectConfiguration(tree, options.project);
  const projectDirectory = options.directory
    ? joinPathFragments(options.directory)
    : '';
  const generatedNames = names(options.name);
  generateFiles(
    tree,
    joinPathFragments(__dirname, '../files/src'),
    joinPathFragments(`${projectConfig.sourceRoot}/${projectDirectory}`),
    generatedNames
  );

  if (!tree.exists(joinPathFragments(`${projectConfig.root}/.storybook`))) {
    tree.delete(
      joinPathFragments(
        `${projectConfig.sourceRoot}/components/${generatedNames.fileName}/${generatedNames.fileName}.stories.ts`
      )
    );
  }
}
