import { convertNxExecutor } from '@nx/devkit';

import { default as executor } from './vitest';

export default convertNxExecutor(executor);
