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

export function isBuildableStencilProject(
  project: { root: string; targets?: Record<string, { executor?: string }> },
  tree?: Tree
): boolean {
  // Back-compat: workspaces that still ship an explicit
  // `@nxext/stencil:build` target in project.json.
  const target =
    project.targets && project.targets['build'] ? project.targets['build'] : {};
  if (target && target.executor === `@nxext/stencil:build`) {
    return true;
  }

  // Crystal path: only buildable libs get a `package.json` at the project
  // root (written by `make-lib-buildable` / the library generator when
  // `buildable: true`). Non-buildable libs ship a `stencil.config.ts` too,
  // but strictly for component authoring — they aren't shippable.
  if (tree && tree.exists(`${project.root}/package.json`)) {
    return true;
  }

  return false;
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
