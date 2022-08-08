import { readJsonFile } from '@nrwl/devkit';

export function getPublishedVersion(pkg: string): string {
  const pkgName = pkg.replace('@nxext/', '');
  process.env.PUBLISHED_VERSION =
    process.env.PUBLISHED_VERSION ||
    // read version of built nx package
    readJsonFile(`./dist/packages/${pkgName}/package.json`).version ||
    // fallback to latest if built nx package is missing
    'latest';
  return process.env.PUBLISHED_VERSION;
}

export function getNxVersion(): string {
  return (
    readJsonFile(`${process.cwd()}/package.json`).devDependencies[
      '@nrwl/workspace'
    ] || 'latest'
  );
}
