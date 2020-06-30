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
