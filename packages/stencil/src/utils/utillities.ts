import ignore from 'ignore';
import { readJson, Tree } from '@nrwl/devkit';
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

export function isBuildableStencilProject(project: any): boolean {
  const target =
    project.targets && project.targets['build'] ? project.targets['build'] : {};
  return target && target.executor === `@nxext/stencil:build`;
}

export const hasError = (diagnostics: Diagnostic[]): boolean => {
  if (diagnostics == null || diagnostics.length === 0) {
    return false;
  }
  return diagnostics.some((d) => d.level === 'error' && d.type !== 'runtime');
};

export function readNxVersion(host: Tree): string {
  const packageJson = readJson(host, 'package.json');

  const nxVersion = packageJson.devDependencies['@nrwl/workspace']
    ? packageJson.devDependencies['@nrwl/workspace']
    : packageJson.dependencies['@nrwl/workspace'];

  if (!nxVersion) {
    throw new Error('@nrwl/workspace is not a dependency.');
  }

  return nxVersion;
}
