/**
 * Reads a json file, removes all comments and parses JSON.
 *
 * @param tree - file system tree
 * @param path - file path
 * @param options - Optional JSON Parse Options
 */
import { JsonParseOptions } from '../install-and-run';
import { parse, ParseError, printParseErrorCode } from 'jsonc-parser';

export function readJson<T extends object = any>(
  tree,
  path: string,
  options?: JsonParseOptions
): T {
  if (!tree.exists(path)) {
    throw new Error(`Cannot find ${path}`);
  }
  try {
    return parseJson(tree.read(path, 'utf-8'), options);
  } catch ({ message }) {
    throw new Error(`Cannot parse ${path}: ${message}`);
  }
}

/**
 * Parses the given JSON string and returns the object the JSON content represents.
 * By default javascript-style comments are allowed.
 *
 * @param input JSON content as string
 * @param options JSON parse options
 * @returns Object the JSON content represents
 */
export function parseJson<T extends object = any>(
  input: string,
  options?: JsonParseOptions
): T {
  try {
    return JSON.parse(input);
    // eslint-disable-next-line no-empty
  } catch {}

  const errors: ParseError[] = [];
  const result: T = parse(input, errors, options);

  if (errors.length > 0) {
    const { error, offset } = errors[0];
    throw new Error(
      `${printParseErrorCode(error)} in JSON at position ${offset}`
    );
  }

  return result;
}
