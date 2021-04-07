import { AddExecutorSchema } from './schema';

export default async function runExecutor(
  options: AddExecutorSchema,
) {
  console.log('Executor ran for Add', options)

  return {
    success: true
  }
}

