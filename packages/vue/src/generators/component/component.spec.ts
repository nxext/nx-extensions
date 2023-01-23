import { createTreeWithEmptyV1Workspace } from '@nrwl/devkit/testing';
import { addDependenciesToPackageJson, Tree } from '@nrwl/devkit';

import { componentGenerator } from './component';
import { Schema } from './schema';
import { uniq } from '@nrwl/nx-plugin/testing';
import libraryGenerator from '../library/library';
import { Linter } from '@nrwl/linter';

describe('component generator', () => {
  let host: Tree;
  const projectName = uniq('test');

  const options: Schema = { name: 'testcomponent', project: projectName };

  beforeEach(() => {
    host = createTreeWithEmptyV1Workspace();
    addDependenciesToPackageJson(host, {}, { '@nrwl/workspace': '15.5.0' });
    libraryGenerator(host, { name: projectName, linter: Linter.None });
  });

  it('should run successfully', async () => {
    await componentGenerator(host, options);

    expect(
      host.exists(`libs/${projectName}/src/components/Testcomponent.vue`)
    ).toBeTruthy();
  });
});
