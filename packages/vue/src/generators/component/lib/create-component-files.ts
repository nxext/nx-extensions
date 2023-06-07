import { generateFiles, names, Tree } from '@nx/devkit';
import { NormalizedSchema } from '../schema';
import { join } from 'path';
import { getComponentTests } from './get-component-tests';
import { getInSourceVitestTestsTemplate } from '../../utils/get-in-source-vitest-tests-template';

export function createComponentFiles(host: Tree, options: NormalizedSchema) {
  const componentTests = getComponentTests(options);
  generateFiles(host, join(__dirname, '../files'), options.projectRoot, {
    ...options,
    componentTests,
    className: names(options.name).className,
    inSourceVitestTests: getInSourceVitestTestsTemplate(componentTests),
    template: '',
  });

  for (const c of host.listChanges()) {
    let deleteFile = false;

    if (
      (options.skipTests || options.inSourceTests) &&
      /.*spec.ts/.test(c.path)
    ) {
      deleteFile = true;
    }

    if (deleteFile) {
      host.delete(c.path);
    }
  }
}
