import { readProjectConfiguration, Tree } from '@nx/devkit';
import { StorybookConfigureSchema } from '../schema';

export function updateMainJs(host: Tree, options: StorybookConfigureSchema) {
  const config = readProjectConfiguration(host, options.name);
  const mainJsFilePath = `${config.root}/.storybook/main.js`;
  const content = host.read(mainJsFilePath, 'utf-8');
  const changedContend = content.replace(/src\/lib/gi, 'src/components');
  host.write(mainJsFilePath, changedContend);
}
