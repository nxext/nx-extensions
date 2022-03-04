import {
  loadTsconfig,
  walkForTsConfig,
} from 'tsconfig-paths/lib/tsconfig-loader.js';
import { normalizePath } from 'vite';
import * as path from 'path';
import { platform } from 'os';
import { statSync } from 'fs';
import { crawl } from 'recrawl-sync';

const isWindows = platform() == 'win32';
const resolve = isWindows
  ? (...paths: string[]) => normalizePath(path.win32.resolve(...paths))
  : path.posix.resolve;

export function findProjects(
  viteRoot: string,
  opts: { projects: string[]; root?: string } = {
    projects: ['tsconfig.app.json'],
  }
) {
  const root = opts.root
    ? resolve(viteRoot, normalizePath(opts.root))
    : viteRoot;

  let { projects } = opts;
  if (!projects) {
    projects = crawl(root, {
      only: ['tsconfig.json'],
      skip: ['node_modules', '.git'],
    });
  }

  // Calculate the depth of each project path.
  const depthMap = {} as Record<string, number>;
  projects = projects.map((projectPath) => {
    projectPath = path.resolve(root, normalizePath(projectPath));
    depthMap[projectPath] =
      projectPath.split('/').length - (projectPath.endsWith('.json') ? 1 : 0);
    return projectPath;
  });

  // Ensure deeper projects take precedence.
  return projects.sort((a, b) => depthMap[b] - depthMap[a]);
}

export function loadConfig(
  cwd: string,
  basePath: string | undefined,
  justLoadedConfig = false
) {
  const configPath = resolveConfigPath(cwd);
  if (configPath) {
    const config = loadTsconfig(configPath);
    if (justLoadedConfig) {
      return config;
    }
    return {
      ...config,
      excludes: undefined,
      extends: undefined,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ...((config as any)?.angularCompilerOptions ?? {}),
      basePath,
      genDir: basePath,
      strictInjectionParameters: true,
      strictInputAccessModifiers: true,
      strictTemplates: true,
      declarationMap: false,
      preserveSymlinks: false,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      enableIvy: (config as any)?.angularCompilerOptions?.enableIvy ?? true,
      noEmitOnError: false,
      suppressOutputPathCheck: true,
      inlineSources: true,
      inlineSourceMap: false,
      allowEmptyCodegenFiles: false,
      annotationsAs: 'decorators',
      enableResourceInlining: false,
      baseUrl: process.cwd(),
      pathsBasePath: process.cwd(),
      rootDir: process.cwd(),
    };
  }
}

// Adapted from https://github.com/dividab/tsconfig-paths/blob/0b259d4cf6cffbc03ad362cfc6bb129d040375b7/src/tsconfig-loader.ts#L65
function resolveConfigPath(cwd: string) {
  if (statSync(cwd).isFile()) {
    return cwd;
  }
  const configPath = walkForTsConfig(cwd);
  if (configPath) {
    return configPath;
  }
  return;
}
