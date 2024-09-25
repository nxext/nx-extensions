import type { Node, PropertyAssignment } from 'typescript';
import { Tree, joinPathFragments } from '@nx/devkit';
import { tsquery } from '@phenomnomnominal/tsquery';
import { NormalizedSchema } from '../schema';

export function updateJestBabelSetup(tree: Tree, options: NormalizedSchema) {
  if (options.unitTestRunner !== 'jest' || options.bundler === 'vite') {
    return;
  }

  const jestConfigPath = joinPathFragments(
    options.appProjectRoot,
    'jest.config.ts'
  );
  const jestFileContents = tree.read(jestConfigPath, 'utf-8');
  const changedFileContents =
    replaceTransformAndAddIgnorePattern(jestFileContents);
  tree.write(jestConfigPath, changedFileContents);
  tree.delete(joinPathFragments(options.appProjectRoot, 'src/App.spec.tsx'));
}

export function replaceTransformAndAddIgnorePattern(fileContents: string) {
  let updatedFileContents = updateTransformProperty(fileContents);
  updatedFileContents = updateTransformIgnorePattern(updatedFileContents);

  if (fileContents === updatedFileContents) {
    return updatedFileContents;
  }

  return updatedFileContents;
}

function updateTransformProperty(fileContents: string) {
  const JEST_PRESET_AST_QUERY =
    'Identifier[name=transform] ~ ObjectLiteralExpression > PropertyAssignment:has(StringLiteral[value=babel-jest])';

  const TRANSFORMER_STRING =
    "'^.+\\\\.[tj]sx?$': ['babel-jest', {configFile: path.resolve(__dirname, '.babelrc')}]";

  const ast = tsquery.ast(fileContents);
  const transformerExpressionNode = tsquery(ast, JEST_PRESET_AST_QUERY, {
    visitAllChildren: true,
  })[0] as Node;

  if (!transformerExpressionNode) {
    return fileContents;
  }

  const transformerIndex = transformerExpressionNode.pos;
  const transformerEndIndex = transformerExpressionNode.end;

  return `${fileContents.slice(
    0,
    transformerIndex
  )}\n${TRANSFORMER_STRING}${fileContents.slice(transformerEndIndex)}`;
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

  return `import * as path from 'path';\n\n${fileContents.slice(
    0,
    transformEndIndex
  )}${TRANSFORM_IGNORE_PATTERN_STRING}${fileContents.slice(transformEndIndex)}`;
}
