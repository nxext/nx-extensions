/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import * as nodePath from 'path';
import { normalizePath as viteNormalizePath } from 'vite';

const normalizationCache = new Map<string, string>();

export function normalizePath(path: string): string {
  let result = normalizationCache.get(path);

  if (result === undefined) {
    result = viteNormalizePath(path);
    normalizationCache.set(path, result);
  }

  return result;
}

const externalizationCache = new Map<string, string>();

function externalizeForWindows(path: string): string {
  let result = externalizationCache.get(path);

  if (result === undefined) {
    result = nodePath.win32.normalize(path);
    externalizationCache.set(path, result);
  }

  return result;
}

export const externalizePath = (() => {
  if (process.platform !== 'win32') {
    return (path: string) => path;
  }

  return externalizeForWindows;
})();
