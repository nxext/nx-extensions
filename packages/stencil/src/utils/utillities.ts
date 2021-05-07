import ignore from 'ignore';
import { Tree } from '@nrwl/devkit';

export function addToGitignore(host: Tree, path: string) {
  if (!host.exists('.gitignore')) {
    return;
  }

  const ig = ignore();
  ig.add(host.read('.gitignore').toString('utf-8'));

  if (!ig.ignores(path)) {
    const gitignore = host.read('.gitignore');
    if (gitignore) {
      const content = `${gitignore.toString('utf-8').trimRight()}\n${path}\n`;
      host.write('.gitignore', content);
    }
  }
}
