import {
  convertNxGenerator,
  generateFiles,
  joinPathFragments,
  logger,
  names,
  stripIndents,
  Tree,
  readProjectConfiguration,
  formatFiles,
} from '@nx/devkit';
import { join } from 'path';
import { insertStatement } from '../../utils/insert-statement';
import { getProjectTsImportPath } from '../storybook-configuration/generator';

export interface ComponentSchema {
  name: string;
  project: string;
  directory?: string;
  style?: string;
  skipFormat?: boolean;
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

  const componentOptions = ((projectConfig || {}).generators || {
    '@nxext/stencil:component': {},
  })['@nxext/stencil:component'];
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
    joinPathFragments(
      `${projectConfig.sourceRoot}/components/${componentDirectory}`
    ),
    {
      componentFileName: componentFileName,
      className: className,
      style: options.style,
    }
  );

  const storiesPath = `${projectConfig.sourceRoot}/components/${componentDirectory}/${componentFileName}.stories.tsx`;
  if (!host.exists('.storybook')) {
    host.delete(joinPathFragments(storiesPath));
  } else {
    const classPathValue = `${getProjectTsImportPath(
      host,
      options.project
    )}/${componentFileName}`;
    insertStatement(
      host,
      storiesPath,
      `import { ${className} } from '${classPathValue}'`
    );
  }

  if (!options.skipFormat) {
    await formatFiles(host);
  }
}

export default componentGenerator;
export const componentSchematic = convertNxGenerator(componentGenerator);
