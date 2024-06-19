import { convertNxExecutor } from '@nx/devkit';

import { testExecutor } from './test.impl';

export default convertNxExecutor(testExecutor);
