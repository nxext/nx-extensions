import {
  convertNxGenerator,
  generateFiles,
  joinPathFragments,
  logger,
  names,
  stripIndents,
  Tree,
  readProjectConfiguration
} from '@nrwl/devkit';
import { join } from 'path';

export interface ComponentSchema {
  name: string;
  project: string;
  directory?: string;
  storybook: boolean;
  style?: string;
}

export async function componentGenerator(host: Tree, options: ComponentSchema) {
  if (!/[-]/.test(options.name)) {
    throw new Error(stripIndents`
      "${options.name}" tag must contain a dash (-) to work as a valid web component. Please refer to
      https://html.spec.whatwg.org/multipage/custom-elements.html#valid-custom-element-name for more info.
      `);
  }

  const componentFileName = names(options.name).fileName;
  const className = names(options.name).className;
  const projectConfig = readProjectConfiguration(host, options.project);

  const componentDirectory = options.directory
    ? joinPathFragments(`${options.directory}/${componentFileName}`)
    : componentFileName;

  const componentOptions = ((projectConfig || {}).generators || { '@nxext/stencil:component': {}, })['@nxext/stencil:component'];
  if (!componentOptions) {
    logger.info(stripIndents`
        Style options for components not set, please run "nx migrate @nxext/stencil"
      `);
  }

  options = {
    ...options,
    ...componentOptions,
  };

  generateFiles(
    host,
    join(__dirname, './files/component'),
    joinPathFragments(`${projectConfig.sourceRoot}/components/${componentDirectory}`),
    {
      componentFileName: componentFileName,
      className: className,
      style: options.style,
    }
  );

  if(!options.storybook) {
    host.delete(
      joinPathFragments(`${projectConfig.sourceRoot}/components/${componentDirectory}/${componentFileName}.stories.ts`)
    );
  }
}

export default componentGenerator;
export const componentSchematic = convertNxGenerator(componentGenerator);
