import { readProjectConfiguration, Tree } from '@nx/devkit';
import { getProjectTsImportPath } from '../generator';

/**
 * `@nx/storybook`'s own preview.ts template is empty by default — fill in the
 * one piece of Stencil-specific wiring Storybook actually needs: registering
 * the generated custom-elements loader so components render at all.
 */
export function updatePreview(host: Tree, projectName: string) {
  const { root } = readProjectConfiguration(host, projectName);
  const loaderDir = getProjectTsImportPath(host, projectName);

  host.write(
    `${root}/.storybook/preview.ts`,
    `import { html } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { defineCustomElements } from '${loaderDir}/loader';

defineCustomElements();

const withThemeProvider = (storyFn, context) => {
  const cssClasses = { centered: context.parameters.layout === 'centered' };

  return html\` <div class="bq-root \${classMap(cssClasses)}">\${storyFn()}</div> \`;
};
export const decorators = [withThemeProvider];
`
  );
}
