import { offsetFromRoot } from '@nx/devkit';

export const extraEslintDependencies = {
  dependencies: {},
  devDependencies: {
    'eslint-config-preact': '^1.2.0',
  },
};

export const createPreactEslintJson = (projectRoot: string) => `
module.exports = {
  "parser": "@typescript-eslint/parser",
  "plugins": ["preact", "@typescript-eslint"],
  "extends": ["${offsetFromRoot(projectRoot)}/.eslintrc.json"],
  "ignorePatterns": ["!**/*"],
  "overrides": [
    {
      "files": ["*.ts", "*.js"],
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
    }
  ]
}`;
