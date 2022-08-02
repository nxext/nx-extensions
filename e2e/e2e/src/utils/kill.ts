import * as kill from 'kill-port';
import { check as portCheck } from 'tcp-port-used';
import { logger } from '@nrwl/devkit';

const KILL_PORT_DELAY = 5000;

export async function killPort(port: number): Promise<boolean> {
  if (await portCheck(port)) {
    try {
      logger.info(`Attempting to close port ${port}`);
      await kill(port);
      await new Promise<void>((resolve) =>
        setTimeout(() => resolve(), KILL_PORT_DELAY)
      );
      if (await portCheck(port)) {
        logger.error(`Port ${port} still open`);
      } else {
        logger.info(`Port ${port} successfully closed`);
        return true;
      }
    } catch {
      logger.error(`Port ${port} closing failed`);
    }
    return false;
  } else {
    return true;
  }
}
