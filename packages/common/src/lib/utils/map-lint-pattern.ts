export function mapLintPattern(
  projectRoot: string,
  extension: string,
  rootProject?: boolean
) {
  const infix = rootProject ? 'src/' : '';
  return `${projectRoot}/${infix}**/*.${extension}`;
}
