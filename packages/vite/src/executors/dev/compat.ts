import { convertNxExecutor } from '@nxext/devkit';

import { default as viteExecutor } from './executor';

export default convertNxExecutor(viteExecutor);
