import { Tree } from '@nx/devkit';
import { NormalizedSchema } from '../schema';
import ignore from 'ignore';

export function updateProjectGitignore(host: Tree, options: NormalizedSchema) {
  if (!host.exists(`${options.projectRoot}/.gitignore`)) {
    return host.write(`${options.projectRoot}/.gitignore`, '/node_modules\n');
  }

  const ig = ignore();
  ig.add(host.read(`${options.projectRoot}/.gitignore`).toString());

  if (!ig.ignores('node_modules')) {
    const content = `${host
      .read(`${options.projectRoot}/.gitignore`)
      .toString('utf-8')
      .trimRight()}\n/node_modules\n`;
    host.write(`${options.projectRoot}/.gitignore`, content);
  }
}
