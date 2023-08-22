import {
  joinPathFragments,
  logger,
  ProjectConfiguration,
  stripIndents,
  Tree,
} from '@nx/devkit';

import { SetupTailwindOptions } from '../schema';

const knownLocations = ['src/assets/main.css'];

export function addTailwindStyleImports(
  tree: Tree,
  project: ProjectConfiguration,
  _options: SetupTailwindOptions
) {
  const candidates = knownLocations.map((x) =>
    joinPathFragments(project.root, x)
  );
  const stylesPath = candidates.find((x) => tree.exists(x));

  if (stylesPath) {
    const content = tree.read(stylesPath).toString();
    tree.write(
      stylesPath,
      `@tailwind base;\n@tailwind components;\n@tailwind utilities;\n${content}`
    );
  } else {
    logger.warn(
      stripIndents`
        Could not find stylesheet to update. Add the following imports to your stylesheet (e.g. styles.css):

          @tailwind base;
          @tailwind components;
          @tailwind utilities;

        See our guide for more details: https://nx.dev/guides/using-tailwind-css-in-react`
    );
  }
}
