import { Logger } from '@stencil/core/cli';
import { isString } from "util";

/*
 * Functions from this file are copied from StencilJS sources, they're not part of the external api but usefull for wire up the process
 * https://github.com/ionic-team/stencil
 */
export const TASK_CANCELED_MSG = `task canceled`;
export const shouldIgnoreError = (msg: any) => {
  return msg === TASK_CANCELED_MSG;
};

export function setupNodeProcess(prcs: NodeJS.Process, logger: Logger) {
  prcs.on(`unhandledRejection`, (e: any) => {
    if (!shouldIgnoreError(e)) {
      let msg = 'unhandledRejection';
      if (e != null) {
        if (isString(e)) {
          msg += ': ' + e;
        } else if (e.stack) {
          msg += ': ' + e.stack;
        } else if (e.message) {
          msg += ': ' + e.message;
        }
      }
      logger.error(msg);
    }
  });
}
