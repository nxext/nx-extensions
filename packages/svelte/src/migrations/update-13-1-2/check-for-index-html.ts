import { logger, ProjectConfiguration, stripIndents, Tree } from '@nrwl/devkit';
import { getSvelteProjects } from '../utils/migration-utils';

export default function update(host: Tree) {
  const svelteProjects = getSvelteProjects(host);

  svelteProjects.forEach(
    (projectConfiguration: ProjectConfiguration, appName: string) => {
      if (projectConfiguration.projectType === 'application') {
        if (!host.exists(`${projectConfiguration.root}/index.html`)) {
          logger.info(stripIndents`
      /*
      ** Attention!
      ** A new index.html is generated into your project root. Please migrate your changes into it from public/index.html.
      ** With Vite the main.ts is imported instead of the bundle.js output. Vite will handle the transformation itself.
      */`);
          createFile(host, projectConfiguration);
        } else {
          host.rename(
            `${projectConfiguration.root}/index.html`,
            `${projectConfiguration.root}/index.html.backup`
          );
          logger.info(stripIndents`
      /*
      ** Attention!
      ** A new index.html is generated into your project root. Please migrate your changes into it from public/index.html or your old index.html.
      ** The index.html from your project root is saved to index.html.backup
      ** With Vite the main.ts is imported instead of the bundle.js output. Vite will handle the transformation itself.
      */`);
          createFile(host, projectConfiguration);
        }
      }
    }
  );
}

function createFile(host: Tree, projectConfiguration: ProjectConfiguration) {
  host.write(
    `${projectConfiguration.root}/index.html`,
    `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" href="/public/favicon.ico" />
    <link rel="stylesheet" href="/public/global.css" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Svelte + TS + Vite App</title>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/main.ts"></script>
  </body>
</html>
`
  );
}
