const { loadConfig, findProjects } = require('./load-tsconfig');
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
  const { id, options, files } = opts;

  const host = createCompilerHost({
    options: opts,
  });
  const originalWriteFile = host.writeFile;
  host.writeFile = (
    fileName,
    data,
    writeByteOrderMark,
    onError,
    sourceFiles
  ) => {
    files.set(fileName, data);
    originalWriteFile(fileName, data, writeByteOrderMark, onError, sourceFiles);
  };

  const programm = createProgram({
    rootNames: [id],
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
