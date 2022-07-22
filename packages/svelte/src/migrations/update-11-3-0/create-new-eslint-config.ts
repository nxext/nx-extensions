/* eslint-disable @typescript-eslint/no-unused-vars */
import { formatFiles, getProjects, offsetFromRoot, Tree } from '@nrwl/devkit';
import { join } from 'path';

export default async function update(host: Tree) {
  const projects = getProjects(host);

  projects.forEach((project) => {
    const eslintConfigPath = join(project.root, '.eslintrc.json');

    if (!host.exists(eslintConfigPath)) {
      return;
    }

    const isSvelteProject =
      project.targets?.build?.executor === '@nxext/svelte:build' ||
      (project.targets?.check?.executor === '@nrwl/workspace:run-commands' &&
        project.targets?.check?.options?.command === 'svelte-check');

    if (isSvelteProject) {
      host.delete(eslintConfigPath);

      host.write(
        join(project.root, '.eslintrc.js'),
        `module.exports = {
            "parser": "@typescript-eslint/parser",
            "plugins": ["svelte3", "@typescript-eslint"],
            "extends": ["${offsetFromRoot(project.root)}.eslintrc.json"],
            "ignorePatterns": ["!**/*"],
            "overrides": [
              {
                "files": ["*.ts", "*.js", "*.svelte"],
                "parserOptions": {
                  "project": ["${project.root}/tsconfig.*?.json"]
                },
                "rules": {}
              },
              {
                "files": ["*.ts", "*.tsx"],
                "rules": {}
              },
              {
                "files": ["*.js", "*.jsx"],
                "rules": {}
              },
              {
                "files": ["*.svelte"],
                "processor": "svelte3/svelte3"
              }
            ],
            "settings": {
              'svelte3/typescript': require('typescript')
            }
          }`
      );
    }
  });
  await formatFiles(host);
}
