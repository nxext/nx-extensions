import { convertNxExecutor } from '@nx/devkit';

import { e2eExecutor } from './e2e.impl';

export default convertNxExecutor(e2eExecutor);
