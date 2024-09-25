import {
  addDependenciesToPackageJson,
  GeneratorCallback,
  getProjects,
  joinPathFragments,
  removeDependenciesFromPackageJson,
  runTasksInSerial,
  Tree,
  logger,
  readJson,
} from '@nx/devkit';
import {
  extraEslintDependencies,
  getEsLintPluginBaseName,
} from '../../utils/lint';
import { findEslintFile } from '@nx/eslint/src/generators/utils/eslint-file';
import {
  deprecatedStencilEslintPlugin,
  stencilEslintPlugin,
} from '../../utils/versions';
import { runNxSync } from 'nx/src/utils/child-process';
import { PackageJson } from 'nx/src/utils/package-json';

export default async function update(host: Tree) {
  if (!isDepInstalled(host, deprecatedStencilEslintPlugin)) {
    logger.info(
      `[@nxext/stencil - migration - change-stencil-eslint-plugin] ${deprecatedStencilEslintPlugin} is not installed. Nothing to be done.`
    );
    logger.info(
      `[@nxext/stencil - migration - change-stencil-eslint-plugin] ${stencilEslintPlugin} will be installed the first time the Stencil app is generated.`
    );
    return;
  }
  const updatePackageJsonTask = updatePackageJson(host);
  const updateEslintConfigFilesCallbacks = await updateEslintConfigFiles(host);
  return runTasksInSerial(
    updatePackageJsonTask,
    ...updateEslintConfigFilesCallbacks
  );
}

function updatePackageJson(host: Tree) {
  removeDependenciesFromPackageJson(
    host,
    [deprecatedStencilEslintPlugin],
    [deprecatedStencilEslintPlugin]
  );
  return addDependenciesToPackageJson(
    host,
    extraEslintDependencies.dependencies,
    extraEslintDependencies.devDependencies
  );
}

async function updateEslintConfigFiles(
  host: Tree
): Promise<GeneratorCallback[]> {
  const generatorCallbacks: GeneratorCallback[] = [];
  const projects = getProjects(host);
  const projectData: {
    name: string;
    root: string;
    lint: boolean;
  }[] = [{ name: 'root', root: '', lint: false } /* root config */].concat(
    Array.from(projects).map((value) => ({
      name: value[1].name,
      root: value[1].root,
      lint: Boolean(value[1].targets?.lint),
    }))
  );
  for (const project of projectData) {
    const eslintConfigFileName = findEslintFile(host, project.root);
    if (eslintConfigFileName) {
      const eslintConfigFileRootPath = joinPathFragments(
        project.root,
        eslintConfigFileName
      );
      const eslintConfigContent = host.read(eslintConfigFileRootPath, 'utf-8');
      if (eslintConfigContent) {
        host.write(
          eslintConfigFileRootPath,
          eslintConfigContent
            .replace(
              new RegExp(
                `plugin:${getEsLintPluginBaseName(
                  deprecatedStencilEslintPlugin
                )}/`,
                'g'
              ),
              `plugin:${getEsLintPluginBaseName(stencilEslintPlugin)}/`
            )
            .replace(
              new RegExp(deprecatedStencilEslintPlugin, 'g'),
              stencilEslintPlugin
            )
        );
      }
      if (project.lint) {
        generatorCallbacks.push(() => {
          runNxSync(`run ${project.name}:lint`, { stdio: 'inherit' });
        });
      }
    }
  }
  return generatorCallbacks;
}

function isDepInstalled(
  host: Tree,
  depName: string
): null | 'dep' | 'devDep' | 'peerDep' | 'optDep' {
  const json = readJson<PackageJson>(host, './package.json');
  if (json.dependencies?.[depName]) {
    return 'dep';
  }
  if (json.devDependencies?.[depName]) {
    return 'devDep';
  }
  if (json.peerDependencies?.[depName]) {
    return 'peerDep';
  }
  if (json.optionalDependencies?.[depName]) {
    return 'optDep';
  }
  return null;
}
