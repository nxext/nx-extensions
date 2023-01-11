import { NormalizedSchema } from '../schema';
import { joinPathFragments, Tree } from '@nrwl/devkit';
import { host } from '@nrwl/angular/generators';

export function updateJestConfig(host: Tree, options: NormalizedSchema) {
  if (options.unitTestRunner !== 'jest') {
    return;
  }

  const jestConfigPath = joinPathFragments(
    `${options.appProjectRoot}/jest.config.ts`
  );
  //const originalContent = host.read(jestConfigPath, 'utf-8');
  //const content = updateJestConfigContent(originalContent);
  //host.write(jestConfigPath, content);

  updateTestSetupFile(host, options);
}

export function updateJestConfigContent(content: string) {
  return content.replace(
    `'babel-jest'`,
    `['babel-jest', { presets: ['solid-jest/preset/browser'] }]`
  );
}

function updateTestSetupFile(host: Tree, options: NormalizedSchema) {
  const setupFilePath = joinPathFragments(
    `${options.appProjectRoot}/src/test-setup.ts`
  );
  const content = `
import 'regenerator-runtime/runtime';
import '@testing-library/jest-dom';
import '@testing-library/jest-dom/extend-expect';`;
  host.write(setupFilePath, content);
}
