import { logger } from '@nxext/devkit';

/**
 * @function replaceFiles
 * @param {({find: string, replacement: string})[]} replacements
 * @return {({name: string, enforce: "pre", Promise<resolveId>})}
 */
export function replaceFiles(
  replacements: Array<{ file: string; with: string }>
) {
  if (!replacements?.length) {
    return null;
  }

  return {
    name: 'rollup-plugin-replace-files',
    enforce: 'pre',
    async resolveId(source, importer) {
      const resolved = await this.resolve(source, importer, { skipSelf: true });

      if (resolved?.id) {
        const foundReplace = replacements.find(
          (replacement) => replacement.file === resolved.id
        );

        if (foundReplace) {
          logger.info(
            `replace "${foundReplace.file}" with "${foundReplace.with}"`
          );

          try {
            // return new file content
            return {
              id: foundReplace.with,
            };
          } catch (err) {
            logger.error(err);

            return null;
          }
        }
      }

      return null;
    },
  };
}
