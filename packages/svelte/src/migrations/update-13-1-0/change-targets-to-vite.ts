import {
  ProjectConfiguration,
  Tree,
  updateProjectConfiguration,
} from '@nrwl/devkit';
import { getSvelteLegacyTargetProjects } from '../utils/migration-utils';

export default function update(host: Tree) {
  const svelteProjects = getSvelteLegacyTargetProjects(host);

  svelteProjects.forEach(
    (projectConfiguration: ProjectConfiguration, appName: string) => {
      if (projectConfiguration.targets.build) {
        if (projectConfiguration.projectType === 'application') {
          projectConfiguration.targets.build = createBuildTarget(
            projectConfiguration.targets.build
          );
        }
        if (projectConfiguration.projectType === 'library') {
          projectConfiguration.targets.build = createPackageTarget(
            projectConfiguration.targets.build
          );
        }
      }

      if (projectConfiguration.targets.serve) {
        projectConfiguration.targets.serve = createServeTarget(
          projectConfiguration.targets.serve
        );
      }
      updateProjectConfiguration(host, appName, projectConfiguration);
    }
  );
}

function createBuildTarget(buildTarget: any) {
  return {
    executor: '@nxext/vite:build',
    outputs: ['{options.outputPath}'],
    options: {
      frameworkConfigFile: '@nxext/svelte/plugins/vite',
      outputPath: buildTarget.options.outputPath,
      assets: [{ glob: '/*', input: './public/**', output: './' }],
      tsConfig: buildTarget.options.tsConfig,
    },
    configurations: {
      production: {},
    },
  };
}

function createServeTarget(serveTarget: any) {
  return {
    executor: '@nxext/vite:dev',
    options: {
      frameworkConfigFile: '@nxext/svelte/plugins/vite',
      outputPath: serveTarget.options.outputPath,
      assets: [{ glob: '/*', input: './public/**', output: './' }],
      tsConfig: serveTarget.options.tsConfig,
    },
  };
}

function createPackageTarget(serveTarget: any) {
  return {
    executor: '@nxext/vite:package',
    outputs: ['{options.outputPath}'],
    options: {
      entryFile: 'src/index.ts',
      frameworkConfigFile: '@nxext/svelte/plugins/vite',
      outputPath: serveTarget.options.outputPath,
      assets: [{ glob: '/*', input: './public/**', output: './' }],
      tsConfig: serveTarget.options.tsConfig,
    },
    configurations: {
      production: {},
    },
  };
}
