import { convertNxExecutor } from '@nrwl/devkit';

import { default as viteExecutor } from './package.impl';

export default convertNxExecutor(viteExecutor);
