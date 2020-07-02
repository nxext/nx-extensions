import { SupportedStyles } from './typings';
import {
  apply,
  forEach,
  mergeWith,
  Rule,
  SchematicContext,
  SchematicsException,
  Source,
  Tree,
} from '@angular-devkit/schematics';
import {
  JsonAstObject,
  JsonParseMode,
  parseJsonAst,
} from '@angular-devkit/core';
import { ProjectType } from '@nrwl/workspace';
import { LibrarySchema } from '../schematics/library/schema';
import { PWASchema } from '../schematics/ionic-pwa/schema';
import { ApplicationSchema } from '../schematics/application/schema';

export function calculateStyle(
  style: SupportedStyles | undefined
): SupportedStyles {
  const styleDefault = 'css';

  if (style == undefined) {
    return styleDefault;
  }

  return /^(css|scss|less|styl|pcss)$/.test(style) ? style : styleDefault;
}

export function applyWithSkipExisting(source: Source, rules: Rule[]): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    const rule = mergeWith(
      apply(source, [
        ...rules,
        forEach((fileEntry) => {
          if (tree.exists(fileEntry.path)) {
            return null;
          }
          return fileEntry;
        }),
      ])
    );

    return rule(tree, _context);
  };
}

export function addDefaultBuilders(
  targetCollection,
  projectType: ProjectType,
  options: LibrarySchema | PWASchema | ApplicationSchema
) {
  addBuilderToTarget(
    targetCollection,
    'build',
    projectType,
    options
  );
  addBuilderToTarget(
    targetCollection,
    'test',
    projectType,
    options
  );
  addBuilderToTarget(
    targetCollection,
    'e2e',
    projectType,
    options
  );
  targetCollection.add({
    name: 'serve',
    builder: `@nxext/stencil:build`,
    options: {
      projectType,
      configPath: `${options.projectRoot}/stencil.config.ts`,
      serve: true,
      watch: true
    },
  });
}

export function addBuilderToTarget(
  targetCollection,
  builder: string,
  projectType: ProjectType,
  options: LibrarySchema | PWASchema | ApplicationSchema
) {
  targetCollection.add({
    name: builder,
    builder: `@nxext/stencil:${builder}`,
    options: {
      projectType,
      configPath: `${options.projectRoot}/stencil.config.ts`,
    },
  });
}

export function parseJsonAtPath(tree: Tree, path: string): JsonAstObject {
  const buffer = tree.read(path);

  if (buffer === null) {
    throw new SchematicsException(`Could not read ${path}.`);
  }

  const content = buffer.toString();

  const json = parseJsonAst(content, JsonParseMode.Strict);
  if (json.kind !== 'object') {
    throw new SchematicsException(`Invalid ${path}. Was expecting an object`);
  }

  return json;
}

export function getLibsDir(): string {
  return 'libs';
}

export function getAppsDir(): string {
  return 'apps';
}
