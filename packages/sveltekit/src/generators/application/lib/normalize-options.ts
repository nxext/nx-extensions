import { joinPathFragments, Tree, workspaceRoot } from '@nx/devkit';
import {
  determineProjectNameAndRootOptions,
  ensureRootProjectName,
} from '@nx/devkit/internal';
import { relative } from 'path';
import { NormalizedSchema, SveltekitGeneratorSchema } from '../schema';

export async function normalizeOptions(
  host: Tree,
  options: SveltekitGeneratorSchema
): Promise<NormalizedSchema> {
  await ensureRootProjectName(
    options as unknown as { directory: string; name?: string },
    'application'
  );

  const { projectName, projectRoot } = await determineProjectNameAndRootOptions(
    host,
    {
      name: options.name,
      projectType: 'application',
      // `directory` is optional on the schema, but the resolver requires a
      // definite string (an empty value falls back to the default
      // as-provided location: `<name>` at the workspace root).
      directory: options.directory ?? '',
      rootProject: options.rootProject,
    }
  );
  options.name ??= projectName;
  options.rootProject = projectRoot === '.';

  const parsedTags = options.tags
    ? options.tags.split(',').map((s) => s.trim())
    : [];

  const distDir = relative(
    joinPathFragments(`${workspaceRoot}/${projectRoot}`),
    joinPathFragments(`${workspaceRoot}/dist/${projectRoot}`)
  );

  return {
    ...options,
    projectName,
    projectRoot,
    distDir,
    parsedTags,
  };
}
