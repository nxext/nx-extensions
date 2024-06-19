import { convertNxExecutor } from '@nx/devkit';

import { serveExecutor } from './serve.impl';

export default convertNxExecutor(serveExecutor);
