import {
  addDependenciesToPackageJson,
  GeneratorCallback,
  getProjects,
  joinPathFragments,
  removeDependenciesFromPackageJson,
  runTasksInSerial,
  Tree,
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

export default async function update(host: Tree) {
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
  }[] = [{ name: 'root', root: void 0, lint: false } /* root config */].concat(
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
          eslintConfigContent.replace(
            new RegExp(
              `plugin:${getEsLintPluginBaseName(
                deprecatedStencilEslintPlugin
              )}/`,
              'g'
            ),
            `plugin:${getEsLintPluginBaseName(stencilEslintPlugin)}/`
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
