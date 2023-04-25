import { getProjects, ProjectConfiguration, Tree } from '@nx/devkit';

export function getSvelteLegacyTargetProjects(tree: Tree) {
  const projects = getProjects(tree);
  const filtered = new Map<string, ProjectConfiguration>();
  projects.forEach((value: ProjectConfiguration, key: string) => {
    if (isSvelteLegacyTargetProject(value)) {
      filtered.set(key, value);
    }
  });

  return filtered;
}

export function isSvelteLegacyTargetProject(project: any): boolean {
  return ['build', 'test', 'serve', 'e2e']
    .map((command) => {
      const target =
        project.targets && project.targets[command]
          ? project.targets[command]
          : {};
      return target && target.executor === `@nxext/svelte:${command}`;
    })
    .some((value) => value === true);
}

export function getSvelteProjects(tree: Tree) {
  const projects = getProjects(tree);
  const filtered = new Map<string, ProjectConfiguration>();
  projects.forEach((value: ProjectConfiguration, key: string) => {
    if (isSvelteProject(value)) {
      filtered.set(key, value);
    }
  });

  return filtered;
}

export function isSvelteProject(project: any): boolean {
  return ['build', 'test', 'serve', 'e2e']
    .map((command) => {
      const target =
        project.targets && project.targets[command]
          ? project.targets[command]
          : {};
      return (
        target &&
        (((target.executor === `@nxext/vite:${command}` ||
          target.executor === `@nxext/vite:package`) &&
          target?.options?.frameworkConfigFile.startsWith('@nxext/svelte')) ||
          target.executor === `@nxext/svelte:${command}`)
      );
    })
    .some((value) => value === true);
}
