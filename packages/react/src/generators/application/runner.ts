import { Schema } from './schema';
import { installAndRun } from '@nxext/plugin-run-utils';

export async function runApplicationGenerator(tree, options: Schema) {
  return installAndRun(['@nrwl/react'], tree, async () => {
    const { applicationGenerator } = await import('./application');
    return applicationGenerator(tree, options);
  });
}

export default runApplicationGenerator;
