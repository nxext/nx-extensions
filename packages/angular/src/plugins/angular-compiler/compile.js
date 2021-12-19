const { loadConfig, findProjects } = require('./load-tsconfig');
const { join } = require('path');
/* eslint-disable @typescript-eslint/no-explicit-any */
async function compile(opts) {
  const projects = findProjects(opts.configResolved.root);
  const userTsConfig = loadConfig(projects[0], opts.configResolved.root);
  const createProgram = await import('@angular/compiler-cli').then(
    (m) => m.createProgram
  );
  const createCompilerHost = await import('@angular/compiler-cli').then(
    (m) => m.createCompilerHost
  );

  opts.options = { ...userTsConfig, ...opts.options };
  opts.options.rootDir = opts.options.baseUrl;
  const { id, options, files } = opts;

  const host = createCompilerHost({
    options: opts,
  });
  host.writeFile = (fileName, data) => {
    files.set(fileName, data);
  };

  const rootNames = [];
  if (id === `${opts.configResolved.root}/src/main.ts`) {
    rootNames.push(`${opts.configResolved.root}/src/${join('polyfills.ts')}`);
  }
  rootNames.push(id);
  const programm = createProgram({
    rootNames,
    options: options,
    host,
  });
  programm.emit();

  const file = id.replace('.ts', '');

  const map = files.get(`${file}.js.map`);
  const code = files.get(`${file}.js`);

  return {
    code: (code ?? '').replace(/\/\/# sourceMappingURL.*/, ''),
    map,
  };
}

module.exports = compile;
