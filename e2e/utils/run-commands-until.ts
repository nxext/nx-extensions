import { ChildProcess, exec } from 'child_process';

const DEFAULT_TIMEOUT_MS = 120_000;

/**
 * Runs `pnpm exec nx <command>` in the given cwd and resolves once stdout+stderr
 * satisfy `criteria`. Rejects on process exit without a match, or after `timeoutMs`.
 */
export function runNxCommandUntil(
  projectDirectory: string,
  command: string,
  criteria: (output: string) => boolean,
  timeoutMs: number = DEFAULT_TIMEOUT_MS
): Promise<ChildProcess> {
  const p = exec(`pnpm exec nx ${command}`, {
    cwd: projectDirectory,
    env: {
      ...process.env,
      NX_NO_CLOUD: 'true',
      NX_DAEMON: 'false',
      FORCE_COLOR: 'false',
    },
    encoding: 'utf-8',
  });

  return new Promise((res, rej) => {
    let output = '';
    let complete = false;

    const timer = setTimeout(() => {
      if (complete) return;
      complete = true;
      p.kill('SIGTERM');
      rej(
        new Error(
          `runNxCommandUntil("${command}") timed out after ${timeoutMs}ms without matching criteria. Last output:\n${output.slice(
            -2000
          )}`
        )
      );
    }, timeoutMs);

    function checkCriteria(c: Buffer | string) {
      output += c.toString();
      if (criteria(stripConsoleColors(output)) && !complete) {
        complete = true;
        clearTimeout(timer);
        res(p);
      }
    }

    p.stdout.on('data', checkCriteria);
    p.stderr.on('data', checkCriteria);
    p.on('exit', (code) => {
      if (complete) return;
      complete = true;
      clearTimeout(timer);
      rej(
        new Error(
          `runNxCommandUntil("${command}") exited with code ${code} before matching criteria. Last output:\n${output.slice(
            -2000
          )}`
        )
      );
    });
  });
}

function stripConsoleColors(log: string): string {
  return log.replace(
    // eslint-disable-next-line no-control-regex
    /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g,
    ''
  );
}
