import { default as update } from './create-new-eslint-config';
import { createTestProject } from '../../generators/utils/testing';
import { readJson, readProjectConfiguration } from '@nrwl/devkit';

describe('create-new-eslint-config', () => {
  let tree;

  beforeEach(async () => {
    tree = await createTestProject('testproject', 'application');
    tree.overwrite(
      'package.json',
      `
      {
        "name": "test-name",
        "dependencies": {},
        "devDependencies": {
          "@nrwl/workspace": "0.0.0"
        }
      }
    `
    );
    tree.delete('.eslintrc.js');
    const config = readProjectConfiguration(tree, 'testproject');
    tree.write(
      `${config.root}/.eslintrc.json`,
      `
{
  "root": true,
  "ignorePatterns": ["**/*"],
  "plugins": ["@nrwl/nx"],
  "overrides": [
    {
      "files": ["*.ts", "*.tsx", "*.js", "*.jsx"],
      "rules": {
        "@nrwl/nx/enforce-module-boundaries": [
          "error",
          {
            "enforceBuildableLibDependency": true,
            "allow": [],
            "depConstraints": [
              {
                "sourceTag": "*",
                "onlyDependOnLibsWithTags": ["*"]
              }
            ]
          }
        ]
      }
    },
    {
      "files": ["*.ts", "*.tsx"],
      "extends": ["plugin:@nrwl/nx/typescript"],
      "rules": {}
    },
    {
      "files": ["*.js", "*.jsx"],
      "extends": ["plugin:@nrwl/nx/javascript"],
      "rules": {}
    }
  ]
}`
    );
    const workspaceJson = readJson(tree, 'workspace.json');
    workspaceJson.projects = {
      ...workspaceJson.projects,
      testproject: {
        root: 'apps/testproject',
        sourceRoot: 'apps/testproject/src',
        projectType: 'application',
        targets: {
          build: {
            executor: '@nxext/svelte:build',
            outputs: ['{options.outputPath}'],
            options: {
              outputPath: 'dist/apps/testproject',
              entryFile: 'apps/testproject/src/main.ts',
              tsConfig: 'apps/testproject/tsconfig.app.json',
              svelteConfig: 'apps/testproject/svelte.config.js',
              assets: [
                {
                  glob: '/*',
                  input: 'apps/testproject/public/**',
                  output: './',
                },
              ],
            },
            configurations: {
              production: {
                dev: false,
              },
            },
          },
          serve: {
            executor: '@nxext/svelte:build',
            options: {
              outputPath: 'dist/apps/testproject',
              entryFile: 'apps/testproject/src/main.ts',
              tsConfig: 'apps/testproject/tsconfig.app.json',
              svelteConfig: 'apps/testproject/svelte.config.js',
              assets: [
                {
                  glob: '/*',
                  input: 'apps/testproject/public/**',
                  output: './',
                },
              ],
              watch: true,
              serve: true,
            },
          },
          lint: {
            executor: '@nrwl/linter:eslint',
            options: {
              lintFilePatterns: ['apps/testproject/**/*.{ts,tsx,js,jsx}'],
            },
          },
          check: {
            executor: '@nrwl/workspace:run-commands',
            options: {
              command: 'svelte-check',
              cwd: 'apps/testproject',
            },
          },
          test: {
            executor: '@nrwl/jest:jest',
            outputs: ['coverage/apps/testproject'],
            options: {
              jestConfig: 'apps/testproject/jest.config.ts',
              passWithNoTests: true,
            },
          },
        },
      },
    };
    tree.overwrite('workspace.json', workspaceJson);
  });

  it(`should create new eslint config`, async () => {
    await update(tree);

    const config = readProjectConfiguration(tree, 'testproject');
    expect(tree.exists(`${config.root}/.eslintrc.json`)).toBeFalsy();
    expect(tree.exists(`${config.root}/.eslintrc.js`)).toBeTruthy();
  });
});
