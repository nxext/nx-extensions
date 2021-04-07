import { AddExecutorSchema } from './schema';
import executor from './executor';

const options: AddExecutorSchema = {};

describe('Add Executor', () => {
  it('can run', async () => {
    const output = await executor(options);
    expect(output.success).toBe(true);
  });
});