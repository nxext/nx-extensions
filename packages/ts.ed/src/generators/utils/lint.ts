import { offsetFromRoot } from '@nx/devkit';
import {
  eslintConfigPrettierVersion,
  eslintPluginPrettierVersion,
  prettierVersion,
} from './versions';

export const extraEslintDependencies = {
  dependencies: {},
  devDependencies: {
    prettier: prettierVersion,
    'eslint-config-prettier': eslintConfigPrettierVersion,
    'eslint-plugin-prettier': eslintPluginPrettierVersion,
  },
};

export const createTsEdEslintJson = (projectRoot: string) => `
module.exports = {
  "parser": "@typescript-eslint/parser",
  "extends": [
    "prettier",
    "plugin:@typescript-eslint/recommended",
    "${offsetFromRoot(projectRoot)}/.eslintrc.json"
  ],
  "plugins": ["@typescript-eslint"],
  "parserOptions": {
    "ecmaVersion": 2018,
    "sourceType": "module",
    "project": "./tsconfig.json"
  },
  "env": {
   "node": true,
   "es6": true
  },
  "rules": {
    "@typescript-eslint/no-inferrable-types": 0,
    "@typescript-eslint/no-unused-vars": 2,
    "@typescript-eslint/no-var-requires": 0
  }
}`;
