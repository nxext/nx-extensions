import { join, dirname } from 'path';
import { existsSync, statSync } from 'fs';

export function resolver(extensions?: string[]) {
  const _extensions = ['ts', ...(extensions ?? [])];

  const resolveFile = (resolved: string, index = false) => {
    for (const extension of _extensions) {
      const file = index
        ? join(resolved, `index.${extension}`)
        : `${resolved}.${extension}`;
      if (existsSync(file)) return file;
    }
    return;
  };

  return function resolveId(id: string, origin: string | undefined) {
    if (!origin || id.includes('node_modules')) return id;
    const resolved = join(dirname(origin), id);
    const file = resolveFile(resolved);
    if (file) return file;
    if (existsSync(resolved) && statSync(resolved).isDirectory()) {
      const coreFile = resolveFile(resolved, true);
      if (coreFile) return coreFile;
    }
    return;
  };
}
