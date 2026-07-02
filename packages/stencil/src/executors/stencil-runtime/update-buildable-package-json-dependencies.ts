import {
  getOutputsForTargetAndConfiguration,
  ProjectGraphExternalNode,
  ProjectGraphProjectNode,
  readJsonFile,
  writeJsonFile,
} from '@nx/devkit';
import { join } from 'path';
import type { DependentBuildableProjectNode } from '@nx/js/internal';

function isNpmProject(
  node: ProjectGraphProjectNode | ProjectGraphExternalNode
): node is ProjectGraphExternalNode {
  return node.type === 'npm';
}

function hasDependency(
  packageJson: Record<string, Record<string, string>>,
  depConfigName: string,
  packageName: string
): boolean {
  return !!packageJson[depConfigName]?.[packageName];
}

/**
 * Reimplements the `@nx/js` `updateBuildableProjectPackageJsonDependencies`
 * helper, removed without replacement in Nx 23 (nrwl/nx#35xxx). Writes the
 * resolved version of each buildable workspace/npm dependency into the
 * built package.json, mirroring the upstream behavior from Nx 22.
 */
export function updateBuildableProjectPackageJsonDependencies(
  root: string,
  projectName: string,
  targetName: string,
  configurationName: string,
  node: ProjectGraphProjectNode,
  dependencies: DependentBuildableProjectNode[],
  typeOfDependency: 'dependencies' | 'peerDependencies' = 'dependencies'
) {
  const outputs = getOutputsForTargetAndConfiguration(
    {
      project: projectName,
      target: targetName,
      configuration: configurationName,
    },
    {},
    node
  );

  const packageJsonPath = `${outputs[0]}/package.json`;
  let packageJson;
  let workspacePackageJson;
  try {
    packageJson = readJsonFile(packageJsonPath);
    workspacePackageJson = readJsonFile(`${root}/package.json`);
  } catch {
    return;
  }

  packageJson.dependencies = packageJson.dependencies || {};
  packageJson.peerDependencies = packageJson.peerDependencies || {};

  let updatePackageJson = false;
  dependencies.forEach((entry) => {
    const packageName = isNpmProject(entry.node)
      ? entry.node.data.packageName
      : entry.name;

    if (
      hasDependency(packageJson, 'dependencies', packageName) ||
      hasDependency(packageJson, 'devDependencies', packageName) ||
      hasDependency(packageJson, 'peerDependencies', packageName)
    ) {
      return;
    }

    try {
      if (!isNpmProject(entry.node) && entry.node.type === 'lib') {
        const depOutputs = getOutputsForTargetAndConfiguration(
          {
            project: projectName,
            target: targetName,
            configuration: configurationName,
          },
          {},
          entry.node
        );
        const depPackageJsonPath = join(root, depOutputs[0], 'package.json');
        const depVersion = readJsonFile(depPackageJsonPath).version;
        packageJson[typeOfDependency][packageName] = depVersion;
        updatePackageJson = true;
      } else if (isNpmProject(entry.node)) {
        if (
          workspacePackageJson.devDependencies?.[entry.node.data.packageName]
        ) {
          return;
        }
        packageJson[typeOfDependency][entry.node.data.packageName] =
          entry.node.data.version;
        updatePackageJson = true;
      }
    } catch {
      // skip if cannot find package.json
    }
  });

  if (updatePackageJson) {
    writeJsonFile(packageJsonPath, packageJson);
  }
}
