const {
  loadTsconfig,
  walkForTsConfig,
} = require('tsconfig-paths/lib/tsconfig-loader.js');
const { normalizePath } = require('vite');
const path = require('path');
const os = require('os');
const { statSync } = require('fs');
const { crawl } = require('recrawl-sync');

const isWindows = os.platform() == 'win32';
const resolve = isWindows
  ? (...paths) => normalizePath(path.win32.resolve(...paths))
  : path.posix.resolve;

function findProjects(viteRoot, opts = { projects: ['tsconfig.app.json'] }) {
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
  const depthMap = {};
  projects = projects.map((projectPath) => {
    projectPath = path.resolve(root, normalizePath(projectPath));
    depthMap[projectPath] =
      projectPath.split('/').length - (projectPath.endsWith('.json') ? 1 : 0);
    return projectPath;
  });

  // Ensure deeper projects take precedence.
  return projects.sort((a, b) => depthMap[b] - depthMap[a]);
}

function loadConfig(cwd, basePath) {
  const configPath = resolveConfigPath(cwd);
  if (configPath) {
    const config = loadTsconfig(configPath);
    return {
      ...config,
      excludes: false,
      extends: undefined,
      ...(config?.angularCompilerOptions ?? {}),
      basePath,
      genDir: basePath,
      strictInjectionParameters: true,
      strictInputAccessModifiers: true,
      strictTemplates: true,
      declarationMap: false,
      preserveSymlinks: false,
      enableIvy: config?.angularCompilerOptions?.enableIvy ?? true,
      noEmitOnError: false,
      suppressOutputPathCheck: true,
      inlineSources: true,
      inlineSourceMap: false,
      allowEmptyCodegenFiles: false,
      annotationsAs: 'decorators',
      enableResourceInlining: false,
    };
  }
}

// Adapted from https://github.com/dividab/tsconfig-paths/blob/0b259d4cf6cffbc03ad362cfc6bb129d040375b7/src/tsconfig-loader.ts#L65
function resolveConfigPath(cwd) {
  if (statSync(cwd).isFile()) {
    return cwd;
  }
  const configPath = walkForTsConfig(cwd);
  if (configPath) {
    return configPath;
  }
}

module.exports = {
  loadConfig,
  findProjects,
};
