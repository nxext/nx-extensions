import { Schema } from './schema';

export async function runApplicationGenerator(tree, options: Schema) {
  return async () => {
    const { applicationGenerator } = await import('./application');
    return await applicationGenerator(tree, options);
  };
}

export default runApplicationGenerator;
