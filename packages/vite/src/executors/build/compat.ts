import { convertNxExecutor } from '@nx/devkit';

import { default as viteExecutor } from './executor';

export default convertNxExecutor(viteExecutor);
