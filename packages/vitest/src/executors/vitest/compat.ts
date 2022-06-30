import { convertNxExecutor } from '@nxext/devkit';

import { default as executor } from './vitest';

export default convertNxExecutor(executor);
