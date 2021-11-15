import { convertNxExecutor } from '@nrwl/devkit';

import serveExecutor from './executor';

export default convertNxExecutor(serveExecutor);
