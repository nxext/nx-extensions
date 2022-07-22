import { installPackagesTask } from './utils/package-manager';
import { ParseOptions } from 'jsonc-parser';
import { readJson } from './utils/json';

export async function installAndRun(nrwlPackages: Array<string>, tree, call) {
  const nxVersion = readNxVersion(tree);
  const deps = nrwlPackages.reduce<Record<string, string>>((acc, cur) => {
    if (cur.startsWith('@nrwl/')) {
      acc[cur] = nxVersion;
    } else {
      console.error('Not a @nrwl nx package');
    }

    return acc;
  }, {} as Record<string, string>);
  addDependenciesToPackageJson(tree, deps, {});
  installPackagesTask(tree);

  return call();
}

function readNxVersion(tree): string {
  const packageJson = readJson(tree, 'package.json');

  const nxVersion = packageJson.devDependencies['@nrwl/workspace']
    ? packageJson.devDependencies['@nrwl/workspace']
    : packageJson.dependencies['@nrwl/workspace'];

  if (!nxVersion) {
    throw new Error('@nrwl/workspace is not a dependency.');
  }

  return nxVersion;
}

export function addDependenciesToPackageJson(
  tree,
  dependencies: Record<string, string>,
  devDependencies: Record<string, string>,
  packageJsonPath = 'package.json'
) {
  const currentPackageJson = readJson(tree, packageJsonPath);

  if (
    requiresAddingOfPackages(currentPackageJson, dependencies, devDependencies)
  ) {
    updateJson(tree, packageJsonPath, (json) => {
      json.dependencies = {
        ...(json.dependencies || {}),
        ...dependencies,
        ...(json.dependencies || {}),
      };
      json.devDependencies = {
        ...(json.devDependencies || {}),
        ...devDependencies,
        ...(json.devDependencies || {}),
      };
      json.dependencies = sortObjectByKeys(json.dependencies);
      json.devDependencies = sortObjectByKeys(json.devDependencies);

      return json;
    });
    return (): void => {
      installPackagesTask(tree);
    };
  }
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  return () => {};
}

/**
 * Verifies whether the given packageJson dependencies require an update
 * given the deps & devDeps passed in
 */
function requiresAddingOfPackages(packageJsonFile, deps, devDeps): boolean {
  let needsDepsUpdate = false;
  let needsDevDepsUpdate = false;

  packageJsonFile.dependencies = packageJsonFile.dependencies || {};
  packageJsonFile.devDependencies = packageJsonFile.devDependencies || {};

  if (Object.keys(deps).length > 0) {
    needsDepsUpdate = Object.keys(deps).some(
      (entry) => !packageJsonFile.dependencies[entry]
    );
  }

  if (Object.keys(devDeps).length > 0) {
    needsDevDepsUpdate = Object.keys(devDeps).some(
      (entry) => !packageJsonFile.devDependencies[entry]
    );
  }

  return needsDepsUpdate || needsDevDepsUpdate;
}

function sortObjectByKeys<T>(obj: T): T {
  if (!obj || typeof obj !== 'object' || Array.isArray(obj)) {
    return obj;
  }
  return Object.keys(obj)
    .sort()
    .reduce((result, key) => {
      return {
        ...result,
        [key]: obj[key],
      };
    }, {}) as T;
}

export interface JsonParseOptions extends ParseOptions {
  /**
   * Expect JSON with javascript-style
   * @default false
   */
  expectComments?: boolean;
  /**
   * Disallow javascript-style
   * @default false
   */
  disallowComments?: boolean;

  /**
   * Allow trailing commas in the JSON content
   */
  allowTrailingComma?: boolean;
}

export interface JsonSerializeOptions {
  /**
   * the whitespaces to add as intentation to make the output more readable.
   * @default 2
   */
  spaces?: number;
}

/**
 * Updates a JSON value to the file system tree
 *
 * @param tree File system tree
 * @param path Path of JSON file in the Tree
 * @param updater Function that maps the current value of a JSON document to a new value to be written to the document
 * @param options Optional JSON Parse and Serialize Options
 */
export function updateJson<T extends object = any, U extends object = T>(
  tree,
  path: string,
  updater: (value: T) => U,
  options?: JsonParseOptions & JsonSerializeOptions
): void {
  const updatedValue = updater(readJson(tree, path, options));
  writeJson(tree, path, updatedValue, options);
}

/**
 * Writes a JSON value to the file system tree

 * @param tree File system tree
 * @param path Path of JSON file in the Tree
 * @param value Serializable value to write
 * @param options Optional JSON Serialize Options
 */
export function writeJson<T extends object = object>(
  tree,
  path: string,
  value: T,
  options?: JsonSerializeOptions
): void {
  tree.write(path, serializeJson(value, options));
}

/**
 * Serializes the given data to a JSON string.
 * By default the JSON string is formatted with a 2 space intendation to be easy readable.
 *
 * @param input Object which should be serialized to JSON
 * @param options JSON serialize options
 * @returns the formatted JSON representation of the object
 */
export function serializeJson<T extends object = object>(
  input: T,
  options?: JsonSerializeOptions
): string {
  return JSON.stringify(input, null, options?.spaces ?? 2) + '\n';
}
