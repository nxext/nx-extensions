import { eslintPluginSvelteVersion } from './versions';
import { offsetFromRoot } from '@nx/devkit';

export const extraEslintDependencies = {
  dependencies: {},
  devDependencies: {
    'eslint-plugin-svelte3': eslintPluginSvelteVersion,
  },
};

export const createSvelteEslintJson = (projectRoot: string) => `
module.exports = {
  "parser": "@typescript-eslint/parser",
  "plugins": ["svelte3", "@typescript-eslint"],
  "extends": ["${offsetFromRoot(projectRoot)}/.eslintrc.json"],
  "ignorePatterns": ["!**/*"],
  "overrides": [
    {
      "files": ["*.ts", "*.js", "*.svelte"],
      "parserOptions": {
        "project": ["${projectRoot}/tsconfig.*?.json"]
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
}`;
