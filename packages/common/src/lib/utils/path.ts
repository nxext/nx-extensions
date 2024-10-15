import { isAbsolute } from 'node:path';

export function getTerminalLinkForAbsolutePath(absolutePath: string) {
  if (!isAbsolute(absolutePath)) {
    return absolutePath;
  }
  return `file:///${absolutePath.replace(/^\//, '').replace(/\\/g, '/')}`;
}
