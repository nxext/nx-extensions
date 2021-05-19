import ignore from 'ignore';
import { Tree, ProjectConfiguration } from '@nrwl/devkit';

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
  project: ProjectConfiguration
): boolean {
  return ['build', 'test', 'serve', 'e2e'].map(command => {
    const target = project.targets[command];
    if(!target) {
      return false;
    }
    return target.executor === `@nxext/stencil:${command}`;
  }).some(value => value === true);
}

export function isProjectBuildable(project: ProjectConfiguration): boolean {
  const command = 'build';
  const target = project.targets[command];
  if(!target) {
    return false;
  }
  return target.executor === `@nxext/stencil:${command}`;
}
