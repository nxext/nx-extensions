import { generateFiles, names, offsetFromRoot, Tree } from '@nx/devkit';
import { NormalizedSchema } from '../schema';
import * as path from 'path';

export function addFiles(host: Tree, options: NormalizedSchema) {
  const templateOptions = {
    ...options,
    ...names(options.name),
    offsetFromRoot: offsetFromRoot(options.projectRoot),
    template: '',
  };
  try {
    // Files identical in both modes (Design 3.2): SvelteKit source/config,
    // static assets, the runtime tsconfigs tsconfig.app.json/
    // tsconfig.spec.json (their TS-solution-specific `extends`/
    // compilerOptions divergence is applied programmatically afterwards by
    // `wireTsSolutionProject`, see generator.ts).
    generateFiles(
      host,
      path.join(__dirname, '../files/common'),
      options.projectRoot,
      templateOptions
    );

    if (options.isUsingTsSolutionConfig) {
      // TS-solution wrapper tsconfig.json: a thin references-only pointer
      // (files/include empty, references to app/spec), mirroring what
      // @nxext/svelte's programmatic createTsConfig writes in TS-solution
      // mode. The legacy wrapper deliberately does NOT get reused here: its
      // baked-in compilerOptions include `importsNotUsedAsValues`, which is
      // removed in TypeScript >= 5.5 and only survives in legacy e2e
      // workspaces because those pin TS 5.x + `ignoreDeprecations: '5.0'`.
      generateFiles(
        host,
        path.join(__dirname, '../files/ts-solution'),
        options.projectRoot,
        templateOptions
      );
    } else {
      // Legacy-only files: the wrapper tsconfig.json with the historical
      // svelte compilerOptions, and package.json. In TS-solution mode
      // package.json has already been written by `addProjectPackageJson`
      // (called from `addProject`, before this function runs) as the
      // authoritative source (name = importPath, `nx.targets`, `type:
      // "module"`) - copying a static template on top here would silently
      // clobber that.
      generateFiles(
        host,
        path.join(__dirname, '../files/non-ts-solution'),
        options.projectRoot,
        templateOptions
      );
    }
  } catch (e) {
    throw new Error(e);
  }
}
