import { convertNxExecutor } from '@nrwl/devkit';

import buildExecutor from './executor';

export default convertNxExecutor(buildExecutor);
