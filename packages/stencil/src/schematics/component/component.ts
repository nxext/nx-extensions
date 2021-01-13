import {
  applyTemplates,
  chain,
  move,
  noop,
  Rule,
  SchematicContext,
  SchematicsException,
  Tree,
  url
} from '@angular-devkit/schematics';
import { getProjectConfig, toClassName, toFileName } from '@nrwl/workspace';
import { applyWithSkipExisting } from '../../utils/utils';
import { join, normalize } from '@angular-devkit/core';
import { stripIndents } from '@angular-devkit/core/src/utils/literals';
import { wrapAngularDevkitSchematic } from '@nrwl/devkit/ngcli-adapter';

export interface ComponentSchema {
  name: string;
  project: string;
  directory?: string;
  storybook: boolean;
  style?: string;
}

function createComponentInProject(options: ComponentSchema): Rule {
  return (tree: Tree, context: SchematicContext) => {
    context.logger.debug('adding component to lib');

    if (!/[-]/.test(options.name)) {
      throw new SchematicsException(stripIndents`
      "${options.name}" tag must contain a dash (-) to work as a valid web component. Please refer to
      https://html.spec.whatwg.org/multipage/custom-elements.html#valid-custom-element-name for more info.
      `);
    }

    const componentFileName = toFileName(options.name);
    const className = toClassName(options.name);
    const projectConfig = getProjectConfig(tree, options.project);

    const projectDirectory = options.directory
      ? join(normalize(options.directory), normalize(toFileName(options.name)))
      : join(normalize(toFileName(options.name)));

    const componentOptions = ((projectConfig || {}).schematics || {
      '@nxext/stencil:component': {},
    })['@nxext/stencil:component'];
    if (!componentOptions) {
      context.logger.info(stripIndents`
        Style options for components not set, please run "nx migrate @nxext/stencil"
      `);
    }

    options = {
      ...options,
      ...componentOptions,
    };

    return chain([
      applyWithSkipExisting(url('./files/src'), [
        applyTemplates({
          componentFileName: componentFileName,
          className: className,
          style: options.style,
        }),
        move(
          join(
            normalize(projectConfig.sourceRoot),
            normalize('components'),
            projectDirectory
          )
        ),
        options.storybook
          ? noop()
          : (tree) =>
              tree.delete(
                join(
                  normalize(projectConfig.sourceRoot),
                  normalize('components'),
                  projectDirectory,
                  `${componentFileName}.stories.ts`
                )
              ),
      ]),
    ])(tree, context);
  };
}

export default function (options: ComponentSchema): Rule {
  return chain([createComponentInProject(options)]);
}

export const componentGenerator = wrapAngularDevkitSchematic(
  '@nxext/stencil',
  'component'
);
