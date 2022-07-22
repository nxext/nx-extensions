import { convertNxExecutor } from '@nrwl/devkit';

import { default as executor } from './vitest';

export default convertNxExecutor(executor);
