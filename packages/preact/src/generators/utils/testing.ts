import { ProjectType } from '@nrwl/workspace';
import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import applicationGenerator from '../application/application';
import { Tree, updateJson } from '@nrwl/devkit';
import { Linter } from '@nrwl/linter';
import { libraryGenerator } from '../library/library';

export async function createTestProject(
  name: string,
  type: ProjectType = ProjectType.Application,
  unitTestrunner: 'none' | 'jest' = 'none',
  e2eTestrunner: 'none' | 'cypress' = 'none'
): Promise<Tree> {
  const host = createTreeWithEmptyWorkspace({ layout: 'apps-libs' });
  updateJson(host, '/package.json', (json) => {
    json.devDependencies = {
      '@nrwl/workspace': '15.6.0',
    };
    return json;
  });

  if (type === ProjectType.Application) {
    await applicationGenerator(host, {
      name: name,
      linter: Linter.EsLint,
      unitTestRunner: unitTestrunner,
      e2eTestRunner: e2eTestrunner,
    });
  }
  if (type === ProjectType.Library) {
    await libraryGenerator(host, {
      name: name,
      linter: Linter.EsLint,
      unitTestRunner: unitTestrunner,
      e2eTestRunner: e2eTestrunner,
      skipFormat: false,
    });
  }

  return host;
}
