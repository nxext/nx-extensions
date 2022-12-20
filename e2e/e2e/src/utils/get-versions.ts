import {
  joinPathFragments,
  readJsonFile,
  readNxJson,
  workspaceRoot,
} from '@nrwl/devkit';

export function getPublishedVersion(pkg: string, distDir: string): string {
  const nxJson = readNxJson();
  const pkgName = pkg.replace(`@${nxJson.npmScope}/`, '');
  process.env.PUBLISHED_VERSION =
    process.env.PUBLISHED_VERSION ||
    // read version of built nx package
    readJsonFile(joinPathFragments(`./${distDir}/${pkgName}/package.json`))
      .version ||
    // fallback to latest if built nx package is missing
    'latest';
  return process.env.PUBLISHED_VERSION;
}

export function getNxVersion(): string {
  const pkgJson = readJsonFile(
    joinPathFragments(workspaceRoot, 'package.json')
  );
  return (
    process.env.NX_VERSION ||
    pkgJson.dependencies['@nrwl/workspace'] ||
    pkgJson.devDependencies['@nrwl/workspace'] ||
    'latest'
  );
}
