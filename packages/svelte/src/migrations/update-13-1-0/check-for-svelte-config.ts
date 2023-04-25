import { ProjectConfiguration, Tree } from '@nx/devkit';
import { getSvelteProjects } from '../utils/migration-utils';

export default function update(host: Tree) {
  const svelteProjects = getSvelteProjects(host);

  svelteProjects.forEach(
    (projectConfiguration: ProjectConfiguration, appName: string) => {
      if (!host.exists(`${projectConfiguration.root}/svelte.config.cjs`)) {
        host.write(
          `${projectConfiguration.root}/svelte.config.cjs`,
          `
const sveltePreprocess = require('svelte-preprocess');

module.exports = {
  // Consult https://github.com/sveltejs/svelte-preprocess
  // for more information about preprocessors
  preprocess: sveltePreprocess()
};`
        );
      }
    }
  );
}
