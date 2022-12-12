import * as kill from 'kill-port';
import { check as portCheck } from 'tcp-port-used';
import { logError, logInfo } from './logger';

/*
 * Originally from the Nx repo e2e/utils/index.ts
 */

const KILL_PORT_DELAY = 5000;

export async function killPort(port: number): Promise<boolean> {
  if (await portCheck(port)) {
    try {
      logInfo(`Attempting to close port ${port}`);
      await kill(port);
      await new Promise<void>((resolve) =>
        setTimeout(() => resolve(), KILL_PORT_DELAY)
      );
      if (await portCheck(port)) {
        logError(`Port ${port} still open`);
      } else {
        logInfo(`Port ${port} successfully closed`);
        return true;
      }
    } catch {
      logError(`Port ${port} closing failed`);
    }
    return false;
  } else {
    return true;
  }
}
