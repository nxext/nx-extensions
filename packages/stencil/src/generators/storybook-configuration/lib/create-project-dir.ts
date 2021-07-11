import { generateFiles, offsetFromRoot, readProjectConfiguration, toJS, Tree } from '@nrwl/devkit';
import { join } from 'path';

export function createProjectStorybookDir(
  tree: Tree,
  projectName: string,
  uiFramework: string,
  js: boolean
) {
  const { root, projectType } = readProjectConfiguration(tree, projectName);
  const projectDirectory = projectType === 'application' ? 'app' : 'lib';

  if (tree.exists(join(root, '.storybook'))) {
    return;
  }

  const templatePath = join(
    __dirname,
    '../project-files'
  );

  generateFiles(tree, templatePath, root, {
    tmpl: '',
    uiFramework,
    offsetFromRoot: offsetFromRoot(root),
    projectType: projectDirectory
  });

  if (js) {
    toJS(tree);
  }
}

export function createRootStorybookDir(
  tree: Tree,
  js: boolean
) {
  if (tree.exists('.storybook')) {
    return;
  }
  const templatePath = join(__dirname, '../root-files');
  generateFiles(tree, templatePath, '', {});

  if (js) {
    toJS(tree);
  }
}
