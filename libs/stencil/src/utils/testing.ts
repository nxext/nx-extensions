import { Architect } from '@angular-devkit/architect';
import { schema } from '@angular-devkit/core';
import { TestingArchitectHost } from '@angular-devkit/architect/testing';
import { join } from 'path';
import { MockBuilderContext } from '@nrwl/workspace/testing';

export const SUPPORTED_STYLE_LIBRARIES = [
  'css',
  'scss',
  'less',
  'styl',
  'pcss',
];

export async function mockContext() {
  const registry = new schema.CoreSchemaRegistry();
  registry.addPostTransform(schema.transforms.addUndefinedDefaults);

  const architectHost = new TestingArchitectHost('/root', '/root');
  const architect = new Architect(architectHost, registry);

  await architectHost.addBuilderFromPackage(join(__dirname, '../..'));

  const context = new MockBuilderContext(architect, architectHost);
  await context.addBuilderFromPackage(join(__dirname, '../..'));
  await context.addTarget({ project: 'test', target: 'test' }, 'build');

  return [architect, context] as [Architect, MockBuilderContext];
}
