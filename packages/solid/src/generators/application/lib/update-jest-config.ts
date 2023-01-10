import { NormalizedSchema } from '../schema';
import { joinPathFragments, Tree } from '@nrwl/devkit';

export function updateJestConfig(host: Tree, options: NormalizedSchema) {
  if (options.unitTestRunner !== 'jest') {
    return;
  }

  const jestConfigPath = joinPathFragments(
    `${options.appProjectRoot}/jest.config.ts`
  );
  const originalContent = host.read(jestConfigPath)?.toString();
  const content = updateJestConfigContent(originalContent);
  host.write(jestConfigPath, content);
}

function updateJestConfigContent(content: string) {
  return content;
}
