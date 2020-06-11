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
  JsonParseMode,
  JsonAstObject,
  parseJsonAst,
} from '@angular-devkit/core';
import { readPackageJson } from '@nrwl/workspace/src/core/file-utils';

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

export function getNxVersionFromWorkspace(): string {
  const packageJSON = readPackageJson();
  return packageJSON.devDependencies['@nrwl/workspace'];
}
