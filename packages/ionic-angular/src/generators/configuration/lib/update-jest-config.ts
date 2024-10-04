import type { PropertyAssignment } from 'typescript';
import { Tree, joinPathFragments } from '@nx/devkit';
import { tsquery } from '@phenomnomnominal/tsquery';
import { NormalizedOptions } from './normalize-options';

export function updateJestConfig(tree: Tree, options: NormalizedOptions) {
  const jestConfigPath = joinPathFragments(
    options.projectRoot,
    'jest.config.ts'
  );
  const jestFileContents = tree.read(jestConfigPath, 'utf-8');
  const changedFileContents = updateTransformIgnorePattern(jestFileContents);
  tree.write(jestConfigPath, changedFileContents);
}

function updateTransformIgnorePattern(fileContents: string): string {
  let TRANSFORM_IGNORE_PATTERN_STRING =
    "transformIgnorePatterns: ['<rootDir>/node_modules/(?!(@ionic/core|@ionic/angular|@stencil/core|.*\\.mjs$))'],";

  if (
    fileContents.includes(
      "transformIgnorePatterns: ['<rootDir>/node_modules/(?!(@ionic/core|@ionic/angular|@stencil/core|.*\\.mjs$))']"
    )
  ) {
    return fileContents;
  }

  const ast = tsquery.ast(fileContents);
  const transformIgnorePatterns = tsquery(
    ast,
    'PropertyAssignment > Identifier[name="transformIgnorePatterns"]'
  )[0] as PropertyAssignment;
  const transformIgnorePatternsStart = transformIgnorePatterns.getStart();
  const transformIgnorePatternsEnd = transformIgnorePatterns.getEnd();
  const transformIgnorePatternsString = fileContents.slice(
    transformIgnorePatternsStart,
    transformIgnorePatternsEnd
  );

  return fileContents.replace(
    transformIgnorePatternsString,
    TRANSFORM_IGNORE_PATTERN_STRING
  );
}
