import { convertNxExecutor } from '@nrwl/devkit';

import buildExecutor from './builder';

export default convertNxExecutor(buildExecutor);
