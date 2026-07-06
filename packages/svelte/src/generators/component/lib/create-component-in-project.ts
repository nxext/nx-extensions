import {
  generateFiles,
  joinPathFragments,
  names,
  readProjectConfiguration,
  Tree,
} from '@nx/devkit';
import { getProjectSourceRoot } from '@nx/js/internal';
import { SvelteComponentSchema } from '../component';

export function createComponentInProject(
  tree: Tree,
  options: SvelteComponentSchema,
) {
  const projectConfig = readProjectConfiguration(tree, options.project);
  // package.json-backed (TS-solution) projects don't carry an explicit
  // `sourceRoot` - getProjectSourceRoot falls back to `<root>/src` for them,
  // and returns the explicit value unchanged for legacy project.json
  // projects.
  const sourceRoot = getProjectSourceRoot(projectConfig, tree);
  const projectDirectory = options.directory
    ? joinPathFragments(options.directory)
    : '';
  const generatedNames = names(options.name);
  generateFiles(
    tree,
    joinPathFragments(__dirname, '../files/src'),
    joinPathFragments(`${sourceRoot}/${projectDirectory}`),
    generatedNames,
  );

  if (!tree.exists(joinPathFragments(`${projectConfig.root}/.storybook`))) {
    tree.delete(
      joinPathFragments(
        `${sourceRoot}/components/${generatedNames.fileName}/${generatedNames.fileName}.stories.ts`,
      ),
    );
  }
}
