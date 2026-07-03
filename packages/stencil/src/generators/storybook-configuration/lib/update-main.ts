import { readProjectConfiguration, Tree } from '@nx/devkit';

/**
 * `@nx/storybook`'s generated main.ts points its stories glob at `src/lib`
 * (its own convention). Stencil generators put components under
 * `src/components` instead — point the glob at the right place.
 */
export function updateMain(host: Tree, projectName: string) {
  const { root } = readProjectConfiguration(host, projectName);
  const mainPath = `${root}/.storybook/main.ts`;
  const content = host.read(mainPath, 'utf-8');
  host.write(mainPath, content.replace(/src\/lib/gi, 'src/components'));
}
