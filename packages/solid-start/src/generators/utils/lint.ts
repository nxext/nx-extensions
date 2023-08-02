import { offsetFromRoot } from '@nx/devkit';

export const extraEslintDependencies = {
  dependencies: {},
  devDependencies: {
    'eslint-plugin-solid': '^0.1.2',
  },
};

export const createSolidEslintJson = (projectRoot: string) => `
module.exports = {
  "parser": "@typescript-eslint/parser",
  "plugins": ["solid", "@typescript-eslint"],
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
  ],
  "settings": {
    'solid/typescript': require('typescript')
  }
}`;
