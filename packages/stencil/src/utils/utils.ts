import {
  Rule,
  Tree
} from '@angular-devkit/schematics';
import ignore from 'ignore';
import { SupportedStyles } from '../stencil-core-utils';

export function calculateStyle(
  style: SupportedStyles | undefined
): SupportedStyles {
  const styleDefault = SupportedStyles.css;

  if (style == undefined) {
    return styleDefault;
  }

  return /^(css|scss|less|styl|pcss)$/.test(style) ? style : styleDefault;
}

export function addToGitignore(path: string): Rule {
  return (tree: Tree) => {
    if (!tree.exists('.gitignore')) {
      return;
    }

    const ig = ignore();
    ig.add(tree.read('.gitignore').toString('utf-8'));

    if (!ig.ignores(path)) {
      const gitignore = tree.read('.gitignore');
      if (gitignore) {
        const content = `${gitignore.toString('utf-8').trimRight()}\n${path}\n`;
        tree.overwrite('.gitignore', content);
      }
    }
  };
}

export function isProjectBuildable(project: any): boolean {
  const builderCommand = 'build';
  const buildArchitect =
    project.architect && project.architect[builderCommand]
      ? project.architect[builderCommand]
      : {};
  return (
    buildArchitect &&
    buildArchitect.builder === `@nxext/stencil:${builderCommand}`
  );
}
