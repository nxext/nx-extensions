export function isStencilProjectBuilder(
  project,
  builderCommand: string
): boolean {
  const buildArchitect =
    project.architect && project.architect[builderCommand]
      ? project.architect[builderCommand]
      : null;
  return (
    buildArchitect &&
    buildArchitect.builder === `@nxext/stencil:${builderCommand}`
  );
}
