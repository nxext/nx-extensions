import {
  ensurePackage,
  getWorkspaceLayout,
  names,
  normalizePath,
  NX_VERSION,
  Tree,
} from '@nx/devkit';
import { ApplicationGeneratorSchema, NormalizedSchema } from '../schema';

export async function normalizeOptions(
  host: Tree,
  options: ApplicationGeneratorSchema
): Promise<NormalizedSchema> {
  ensurePackage('@nx/js', NX_VERSION);
  const { getNpmScope } = await import(
    '@nx/js/src/utils/package-json/get-npm-scope'
  );

  const appName = options.name;

  const appDirectory = options.directory
    ? `${names(options.directory).fileName}/${names(options.name).fileName}`
    : names(options.name).fileName;

  const appProjectName = appDirectory.replace(new RegExp('/', 'g'), '-');

  const { appsDir } = getWorkspaceLayout(host);
  const appProjectRoot = normalizePath(`${appsDir}/${appDirectory}`);
  const npmScope = getNpmScope(host);

  return {
    ...options,
    appName,
    name: names(options.name).fileName,
    prefix: npmScope,
    appProjectName,
    appProjectRoot,
    standalone: false,
  };
}
