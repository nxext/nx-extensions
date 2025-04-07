import { SupportedStyles } from '../stencil-core-utils';
import { Tree, updateJson } from '@nx/devkit';
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { libraryGenerator } from '../generators/library/generator';
import { ProjectType } from './typings';

/**
 * The value of `npmScope` in an nx.json file
 */

export async function createTestUILib(
  libDirectory: string,
  style: SupportedStyles = SupportedStyles.css,
  buildable = true
): Promise<Tree> {
  const host = createTreeWithEmptyWorkspace({ layout: 'apps-libs' });
  updateJson(host, '/package.json', (json) => {
    json.devDependencies = {
      '@nx/workspace': '17.0.0',
    };
    return json;
  });

  await libraryGenerator(host, {
    name: libDirectory.split('/').pop(),
    directory: libDirectory,
    style: style,
    buildable,
    publishable: false,
  });

  return host;
}

export function fileListForAppType(
  projectDir: string,
  style: string,
  projectType: ProjectType
): string[] {
  if (projectType == 'application') {
    return [
      `${projectDir}/src/global/app.${style}`,
      `${projectDir}/src/global/app.ts`,
      `${projectDir}/stencil.config.ts`,
      `${projectDir}/tsconfig.json`,
      `${projectDir}/src/components/app-home/app-home.e2e.ts`,
      `${projectDir}/src/components/app-home/app-home.tsx`,
      `${projectDir}/src/components/app-home/app-home.${style}`,
      `${projectDir}/src/components/app-profile/app-profile.e2e.ts`,
      `${projectDir}/src/components/app-profile/app-profile.tsx`,
      `${projectDir}/src/components/app-profile/app-profile.spec.ts`,
      `${projectDir}/src/components/app-profile/app-profile.${style}`,
      `${projectDir}/src/components/app-root/app-root.e2e.ts`,
      `${projectDir}/src/components/app-root/app-root.tsx`,
      `${projectDir}/src/components/app-root/app-root.${style}`,
    ];
  }

  if (projectType == 'library') {
    return [
      `${projectDir}/stencil.config.ts`,
      `${projectDir}/tsconfig.json`,
      `${projectDir}/src/components/my-component/my-component.e2e.ts`,
      `${projectDir}/src/components/my-component/my-component.spec.ts`,
      `${projectDir}/src/components/my-component/my-component.tsx`,
      `${projectDir}/src/components/my-component/my-component.${style}`,
      `${projectDir}/src/utils/utils.spec.ts`,
      `${projectDir}/src/utils/utils.ts`,
    ];
  }
}
