import { createTreeWithEmptyV1Workspace } from '@nrwl/devkit/testing';
import {
  Tree,
  readProjectConfiguration,
  addDependenciesToPackageJson,
} from '@nrwl/devkit';

import applicationGenerator from './application';
import { Schema } from './schema';
import { uniq } from '@nrwl/nx-plugin/testing';

describe('app generator', () => {
  let host: Tree;
  const projectName = uniq('test');
  const options: Schema = { name: projectName, unitTestRunner: 'none' };

  beforeEach(() => {
    host = createTreeWithEmptyV1Workspace();
    addDependenciesToPackageJson(host, {}, { '@nrwl/workspace': '15.5.0' });
  });

  it('should run successfully', async () => {
    await applicationGenerator(host, options);
    const config = readProjectConfiguration(host, projectName);
    expect(config).toBeDefined();
  });
});
