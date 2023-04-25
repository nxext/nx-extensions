import { convertNxExecutor } from '@nx/devkit';

import serveExecutor from './executor';

export default convertNxExecutor(serveExecutor);
