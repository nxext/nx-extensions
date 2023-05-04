import { convertNxExecutor } from '@nx/devkit';

import buildExecutor from './executor';

export default convertNxExecutor(buildExecutor);
