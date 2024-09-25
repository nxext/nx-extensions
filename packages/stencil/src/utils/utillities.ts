import { readJson, Tree } from '@nx/devkit';
import type { Diagnostic } from '@stencil/core/compiler';
import { SupportedStyles } from '../stencil-core-utils';

export function calculateStyle(
  style: SupportedStyles | undefined
): SupportedStyles {
  const styleDefault = SupportedStyles.css;

  if (style == undefined) {
    return styleDefault;
  }

  return /^(css|scss)$/.test(style) ? style : styleDefault;
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

  const nxVersion = packageJson.devDependencies['@nx/workspace']
    ? packageJson.devDependencies['@nx/workspace']
    : packageJson.dependencies['@nx/workspace'];

  if (!nxVersion) {
    throw new Error('@nx/workspace is not a dependency.');
  }

  return nxVersion;
}
