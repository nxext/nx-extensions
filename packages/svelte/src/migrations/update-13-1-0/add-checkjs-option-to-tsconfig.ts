import {
  ProjectConfiguration,
  Tree,
  readJson,
  updateJson,
  logger,
  stripIndents,
} from '@nxext/devkit';
import { getSvelteLegacyTargetProjects } from '../utils/migration-utils';

export default function update(host: Tree) {
  const svelteProjects = getSvelteLegacyTargetProjects(host);

  svelteProjects.forEach((projectConfiguration: ProjectConfiguration) => {
    const tsConfigPath = `${projectConfiguration.root}/tsconfig.json`;
    const tsconfig = readJson(host, tsConfigPath);

    tsconfig.compilerOptions = { ...tsconfig.compilerOptions, checkJs: true };

    logger.info(stripIndents`
    /*
    ** The tsconfig vite plugin needs checkJs set to work with Svelte.
    */
    `);

    logger.info(`Updated ${tsConfigPath}`);
    updateJson(host, tsConfigPath, tsconfig);
  });
}
