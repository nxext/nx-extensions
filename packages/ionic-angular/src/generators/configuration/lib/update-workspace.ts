import {
  normalizePath,
  readProjectConfiguration,
  Tree,
  updateProjectConfiguration,
} from '@nx/devkit';
import { ConfigurationGeneratorSchema } from '../schema';

export function updateWorkspace(
  host: Tree,
  options: ConfigurationGeneratorSchema
) {
  const projectConfig = readProjectConfiguration(host, options.project);
  const projectRoot = projectConfig.root;

  projectConfig.targets.build.options.assets = [
    ...projectConfig.targets.build.options.assets.filter(
      (asset: string | Record<string, string>) =>
        asset.toString().includes('src/favicon.ico') ||
        asset.toString().includes(`public/favicon.ico`)
    ),
    {
      glob: '**/*.svg',
      input: 'node_modules/ionicons/dist/ionicons/svg',
      output: './svg',
    },
  ];

  projectConfig.targets.build.options.styles = [
    ...projectConfig.targets.build.options.styles,
    normalizePath(`${projectRoot}/src/theme/variables.scss`),
    normalizePath('node_modules/@ionic/angular/css/core.css'),
    normalizePath('node_modules/@ionic/angular/css/normalize.css'),
    normalizePath('node_modules/@ionic/angular/css/structure.css'),
    normalizePath('node_modules/@ionic/angular/css/typography.css'),
    normalizePath('node_modules/@ionic/angular/css/display.css'),
    normalizePath('node_modules/@ionic/angular/css/padding.css'),
    normalizePath('node_modules/@ionic/angular/css/float-elements.css'),
    normalizePath('node_modules/@ionic/angular/css/text-alignment.css'),
    normalizePath('node_modules/@ionic/angular/css/text-transformation.css'),
    normalizePath('node_modules/@ionic/angular/css/flex-utils.css'),
    normalizePath('node_modules/@ionic/angular/css/palettes/dark.system.css'),
  ];

  updateProjectConfiguration(host, options.project, projectConfig);
}
