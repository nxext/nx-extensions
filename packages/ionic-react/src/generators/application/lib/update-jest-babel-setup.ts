import type { Tree } from '@nrwl/devkit';
import type { PropertyAssignment } from 'typescript';
import { joinPathFragments } from '@nrwl/devkit';
import { tsquery } from '@phenomnomnominal/tsquery';
import { NormalizedSchema } from '../schema';

export function updateJestBabelSetup(tree: Tree, options: NormalizedSchema) {
  if (options.unitTestRunner !== 'jest') {
    return;
  }

  const jestConfigPath = joinPathFragments(
    options.appProjectRoot,
    'jest.config.ts'
  );
  const jestFileContents = tree.read(jestConfigPath, 'utf-8');
  const changedFileContents = updateTransformIgnorePattern(jestFileContents);
  tree.write(jestConfigPath, changedFileContents);
  tree.delete(joinPathFragments(options.appProjectRoot, 'src/App.spec.tsx'));
}

function updateTransformIgnorePattern(fileContents: string) {
  const TRANSFORM_OBJECT_AST_QUERY =
    'PropertyAssignment:has(Identifier[name=transform])';
  let TRANSFORM_IGNORE_PATTERN_STRING =
    "transformIgnorePatterns: ['node_modules/(?!(@ionic/react|@ionic/react-router|@ionic/core|@stencil/core|ionicons)/)'],";

  if (
    fileContents.includes(
      "transformIgnorePatterns: ['node_modules/(?!(@ionic/react|@ionic/react-router|@ionic/core|@stencil/core|ionicons)/)']"
    )
  ) {
    return fileContents;
  }

  const ast = tsquery.ast(fileContents);

  const transformObjectNode = tsquery(ast, TRANSFORM_OBJECT_AST_QUERY, {
    visitAllChildren: true,
  })[0] as PropertyAssignment;

  if (!transformObjectNode) {
    return fileContents;
  }

  let transformEndIndex = transformObjectNode.getEnd();
  if (fileContents.charAt(transformEndIndex) == ',') {
    transformEndIndex = transformObjectNode.getEnd() + 1;
    TRANSFORM_IGNORE_PATTERN_STRING = `\n${TRANSFORM_IGNORE_PATTERN_STRING}`;
  } else {
    TRANSFORM_IGNORE_PATTERN_STRING = `,\n${TRANSFORM_IGNORE_PATTERN_STRING}`;
  }

  return `${fileContents.slice(
    0,
    transformEndIndex
  )}${TRANSFORM_IGNORE_PATTERN_STRING}${fileContents.slice(transformEndIndex)}`;
}
