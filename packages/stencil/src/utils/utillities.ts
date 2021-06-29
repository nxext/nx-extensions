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

export function isStencilProject(
  project: any
): boolean {
  return ['build', 'test', 'serve', 'e2e'].map(command => {
    const target =
      project.targets && project.targets[command]
        ? project.targets[command]
        : {};
    return (
      target &&
      target.executor === `@nxext/stencil:${command}`
    );
  }).some(value => value === true);
}

export function isBuildableStencilProject(
  project: any
): boolean {
  const target =
    project.targets && project.targets['build']
      ? project.targets['build']
      : {};
  return (
    target &&
    target.executor === `@nxext/stencil:build`
  );
}
