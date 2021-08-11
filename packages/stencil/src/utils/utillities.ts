import ignore from 'ignore';
import { Tree } from '@nrwl/devkit';
import type { Diagnostic } from '@stencil/core/compiler';
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

export function addToGitignore(host: Tree, path: string) {
  if (!host.exists('.gitignore')) {
    return;
  }

  const ig = ignore();
  ig.add(host.read('.gitignore').toString('utf-8'));

  if (!ig.ignores(path)) {
    const gitignore = host.read('.gitignore');
    if (gitignore) {
      const content = `${gitignore.toString('utf-8').trimRight()}\n${path}\n`;
      host.write('.gitignore', content);
    }
  }
}

export function isStencilProject(
  project: any
): boolean {
  return ['build', 'test', 'serve', 'e2e'].map(command => {
    const target =
      project.targets && project.targets[command]
        ? project.targets[command]
        : {};
    return (
      target &&
      target.executor === `@nxext/stencil:${command}`
    );
  }).some(value => value === true);
}

export function isBuildableStencilProject(
  project: any
): boolean {
  const target =
    project.targets && project.targets['build']
      ? project.targets['build']
      : {};
  return (
    target &&
    target.executor === `@nxext/stencil:build`
  );
}

export const hasError = (diagnostics: Diagnostic[]): boolean => {
  if (diagnostics == null || diagnostics.length === 0) {
    return false;
  }
  return diagnostics.some((d) => d.level === 'error' && d.type !== 'runtime');
};
