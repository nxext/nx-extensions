import type { CompilerHost, CompilerOptions } from 'typescript';
import { loadConfig, findProjects } from './load-tsconfig';
import { join } from 'path';
import type { ResolvedConfig } from 'vite';
import type {
  CompilerHost as NgCompilerHost,
  CompilerOptions as NgCompilerOptions,
} from '@angular/compiler-cli';

export interface CompileOptions {
  id: string;
  host: NgCompilerHost;
  options: CompilerOptions;
  files: Map<string, string>;
  configResolved: ResolvedConfig;
  compilerModule: typeof import('@angular/compiler-cli');
}
export async function compile(opts: CompileOptions) {
  const projects = findProjects(opts.configResolved.root);
  const userTsConfig = loadConfig(projects[0], opts.configResolved.root);

  opts.options = { ...userTsConfig, ...opts.options };
  opts.options.rootDir = opts.options.baseUrl;
  const { id, options, files, host, compilerModule } = opts;

  (host as CompilerHost).writeFile = (fileName, data) => {
    files.set(fileName, data);
  };

  const rootNames = [];
  if (id === `${opts.configResolved.root}/src/main.ts`) {
    rootNames.push(`${opts.configResolved.root}/src/${join('polyfills.ts')}`);
  }
  rootNames.push(id);
  const programm = compilerModule.createProgram({
    rootNames,
    options: options as NgCompilerOptions,
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
