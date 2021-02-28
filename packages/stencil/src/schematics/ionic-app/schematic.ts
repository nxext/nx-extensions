import {
  apply,
  applyTemplates,
  chain,
  externalSchematic,
  mergeWith,
  move,
  Rule,
  Tree,
  url,
} from '@angular-devkit/schematics';
import {
  addDepsToPackageJson,
  addPackageWithInit,
  addProjectToNxJsonInTree,
  formatFiles,
  offsetFromRoot,
  ProjectType,
  updateWorkspace,
} from '@nrwl/workspace';
import { names, logger } from '@nrwl/devkit';
import { IonicAppSchema } from './schema';
import { AppType } from '../../utils/typings';
import { addDefaultBuilders, calculateStyle } from '../../utils/utils';
import { appsDir } from '@nrwl/workspace/src/utils/ast-utils';
import { stripIndents } from '@angular-devkit/core/src/utils/literals';
import { initSchematic } from '../init/init';
import { capacitorVersion } from '../../utils/versions';
import { join } from 'path';
import { addStylePluginToConfigInTree } from '../../stencil-core-utils';
import { wrapAngularDevkitSchematic } from '@nrwl/devkit/ngcli-adapter';
import { detectPackageManager } from '@nrwl/tao/src/shared/package-manager';
import { CapacitorSchematicSchema } from '@nxtend/capacitor';
const projectType = ProjectType.Application;

function normalizeOptions(options: IonicAppSchema, host: Tree): IonicAppSchema {
  const name = names(options.name).fileName;
  const projectDirectory = options.directory
    ? `${names(options.directory).fileName}/${name}`
    : name;
  const projectName = projectDirectory.replace(new RegExp('/', 'g'), '-');
  const projectRoot = `${appsDir(host)}/${projectDirectory}`;
  const parsedTags = options.tags
    ? options.tags.split(',').map((s) => s.trim())
    : [];

  const style = calculateStyle(options.style);
  const appType = AppType.capacitorapp;
  const appTemplate = names(options.appTemplate).fileName;

  return {
    ...options,
    projectName,
    projectRoot,
    projectDirectory,
    parsedTags,
    style,
    appType,
    appTemplate,
  } as IonicAppSchema;
}

function addFiles(options: IonicAppSchema): Rule {
  return mergeWith(
    apply(url(`./files/${options.appTemplate}`), [
      applyTemplates({
        ...options,
        ...names(options.name),
        offsetFromRoot: offsetFromRoot(options.projectRoot),
      }),
      move(options.projectRoot),
      formatFiles({ skipFormat: false }),
    ])
  );
}

function showInformation(options: IonicAppSchema): Rule {
  return () => {
    logger.info(stripIndents`
      You need to build '${options.projectName}' first.
      nx build ${options.projectName}

      After that you're able to add the native platforms to the Capacitor project

      Android: nx run ${options.projectName}:add --platform android
      iOS:     nx run ${options.projectName}:add --platform ios

      Now you're done and ready to run the project

      Android: nx run ${options.projectName}:open --platform android
      iOS:     nx run ${options.projectName}:open --platform ios

      The documentation for the nx capacitor plugin is here:
      https://nxtend.dev/docs/capacitor/overview

      Build something awesome!
    `);
  };
}

export default function (options: IonicAppSchema): Rule {
  return (host: Tree) => {
    const normalizedOptions = normalizeOptions(options, host);
    return chain([
      initSchematic(normalizedOptions),
      updateWorkspace((workspace) => {
        const targetCollection = workspace.projects.add({
          name: normalizedOptions.projectName,
          root: normalizedOptions.projectRoot,
          sourceRoot: `${normalizedOptions.projectRoot}/src`,
          projectType,
          schematics: {
            '@nxext/stencil:component': {
              style: options.style,
              storybook: false,
            },
          },
        }).targets;
        addDefaultBuilders(targetCollection, projectType, normalizedOptions);
      }),
      addProjectToNxJsonInTree(normalizedOptions.projectName, {
        tags: normalizedOptions.parsedTags,
      }),
      addFiles(normalizedOptions),
      addDepsToPackageJson({}, { '@nxtend/capacitor': capacitorVersion }),
      addPackageWithInit('@nxtend/capacitor'),
      externalSchematic('@nxtend/capacitor', 'capacitor-project', {
        project: normalizedOptions.projectName,
        appName: normalizedOptions.projectName,
        npmClient: detectPackageManager(),
        webDir: `dist/${options.projectRoot}/www`,
      } as CapacitorSchematicSchema),
      addStylePluginToConfigInTree(
        join(normalizedOptions.projectRoot, 'stencil.config.ts'),
        normalizedOptions.style
      ),
      showInformation(normalizedOptions),
    ]);
  };
}

export const ionicAppGenerator = wrapAngularDevkitSchematic(
  '@nxext/stencil',
  'ionic-app'
);
