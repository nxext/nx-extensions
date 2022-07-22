import { convertNxExecutor } from '@nrwl/devkit';

import { default as viteExecutor } from './executor';

export default convertNxExecutor(viteExecutor);
