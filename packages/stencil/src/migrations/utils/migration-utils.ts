export function isStencilProjectBuilder(
  project: any,
  builderCommand: string
): boolean {
  const buildArchitect =
    project.architect && project.architect[builderCommand]
      ? project.architect[builderCommand]
      : {};
  return (
    buildArchitect &&
    buildArchitect.builder === `@nxext/stencil:${builderCommand}`
  );
}

export function isStencilProject(project: any): boolean {
  return ['build', 'test', 'serve', 'e2e']
    .map((command) => {
      const target =
        project.targets && project.targets[command]
          ? project.targets[command]
          : {};
      return target && target.executor === `@nxext/stencil:${command}`;
    })
    .some((value) => value === true);
}
