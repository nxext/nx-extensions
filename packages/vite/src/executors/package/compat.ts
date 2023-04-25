import { convertNxExecutor } from '@nx/devkit';

import { default as viteExecutor } from './package.impl';

export default convertNxExecutor(viteExecutor);
