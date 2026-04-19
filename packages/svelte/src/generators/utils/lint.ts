import { eslintPluginSvelteVersion } from './versions';
import { offsetFromRoot } from '@nx/devkit';

// svelte 5 ecosystem: eslint-plugin-svelte (not the old eslint-plugin-svelte3)
// parses .svelte files via svelte-eslint-parser; no more `processor`.
export const extraEslintDependencies = {
  dependencies: {},
  devDependencies: {
    'eslint-plugin-svelte': eslintPluginSvelteVersion,
  },
};

export const createSvelteEslintJson = (projectRoot: string) => `
module.exports = {
  "extends": ["${offsetFromRoot(projectRoot)}/.eslintrc.json"],
  "ignorePatterns": ["!**/*"],
  "overrides": [
    {
      "files": ["*.ts", "*.js"],
      "parser": "@typescript-eslint/parser",
      "parserOptions": {
        "project": ["${projectRoot}/tsconfig.*?.json"]
      },
      "rules": {}
    },
    {
      "files": ["*.svelte"],
      "parser": "svelte-eslint-parser",
      "parserOptions": {
        "parser": "@typescript-eslint/parser"
      },
      "rules": {}
    }
  ]
}`;
