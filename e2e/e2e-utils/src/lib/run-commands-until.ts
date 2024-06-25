import { ChildProcess, exec } from 'child_process';
import { tmpProjPath } from '@nx/plugin/testing';
import { getPackageManagerCommand } from '@nx/devkit';

export function runNxCommandUntil(
  command: string,
  criteria: (output: string) => boolean
): Promise<ChildProcess> {
  const pm = getPackageManagerCommand();
  const childProcess: ChildProcess = exec(pm.run('nx', command), {
    cwd: tmpProjPath(),
    env: {
      ...process.env,
      FORCE_COLOR: 'false',
    },
    encoding: 'utf-8',
  });
  return new Promise((res, rej) => {
    let output = '';
    let complete = false;

    function checkCriteria(c: any) {
      output += c.toString();
      if (criteria(stripConsoleColors(output)) && !complete) {
        complete = true;
        res(childProcess);
      }
    }

    childProcess.stdout?.on('data', checkCriteria);
    childProcess.stderr?.on('data', checkCriteria);
    childProcess.on('exit', (code) => {
      if (!complete) {
        rej(`Exited with ${code}`);
      } else {
        res(childProcess);
      }
    });
  });
}

/**
 * Remove log colors for fail proof string search
 * @param log
 * @returns
 */
function stripConsoleColors(log: string): string {
  return log.replace(
    // eslint-disable-next-line no-control-regex
    /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g,
    ''
  );
}
