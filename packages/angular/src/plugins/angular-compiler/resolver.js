const { join, dirname } = require('path');
const { existsSync, statSync } = require('fs');

function resolver(extensions) {
  const _extensions = ['ts', ...(extensions ?? [])];

  const resolveFile = (resolved, index = false) => {
    for (const extension of _extensions) {
      const file = index
        ? join(resolved, `index.${extension}`)
        : `${resolved}.${extension}`;
      if (existsSync(file)) return file;
    }
  };

  return function resolveId(id, origin) {
    if (!origin || id.includes('node_modules')) return id;
    const resolved = join(dirname(origin), id);
    const file = resolveFile(resolved);
    if (file) return file;
    if (existsSync(resolved) && statSync(resolved).isDirectory()) {
      const coreFile = resolveFile(resolved, true);
      if (coreFile) return coreFile;
    }
  };
}

module.exports = resolver;
