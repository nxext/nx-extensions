import { joinPathFragments, readJsonFile, workspaceRoot } from '@nrwl/devkit';

export function getNxVersion(): string {
  const pkgJson = readJsonFile(
    joinPathFragments(workspaceRoot, 'package.json')
  );
  return (
    process.env.NX_VERSION ||
    pkgJson.dependencies['nx'] ||
    pkgJson.devDependencies['nx'] ||
    pkgJson.dependencies['@nrwl/workspace'] ||
    pkgJson.devDependencies['@nrwl/workspace'] ||
    'latest'
  );
}
