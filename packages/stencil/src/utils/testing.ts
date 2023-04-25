import { SupportedStyles } from '../stencil-core-utils';
import {
  readWorkspaceConfiguration,
  Tree,
  updateJson,
  updateWorkspaceConfiguration,
} from '@nx/devkit';
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { libraryGenerator } from '../generators/library/generator';
import { ProjectType } from './typings';

/**
 * The value of `npmScope` in an nx.json file
 */
export const testNpmScope = 'test-workspace';

export async function createTestUILib(
  libName: string,
  style: SupportedStyles = SupportedStyles.css,
  buildable = true
): Promise<Tree> {
  const host = createTreeWithEmptyWorkspace({ layout: 'apps-libs' });
  updateJson(host, '/package.json', (json) => {
    json.devDependencies = {
      '@nx/workspace': '15.7.0',
    };
    return json;
  });
  const workspaceConfiguration = readWorkspaceConfiguration(host);
  workspaceConfiguration.npmScope = testNpmScope;
  updateWorkspaceConfiguration(host, workspaceConfiguration);

  await libraryGenerator(host, {
    name: libName,
    style: style,
    buildable,
    publishable: false,
  });

  return host;
}

export function fileListForAppType(
  projectName: string,
  style: string,
  projectType: ProjectType,
  subDirectory?: string
): string[] {
  if (!subDirectory) {
    if (projectType == 'application') {
      return [
        `apps/${projectName}/src/global/app.${style}`,
        `apps/${projectName}/src/global/app.ts`,
        `apps/${projectName}/stencil.config.ts`,
        `apps/${projectName}/tsconfig.json`,
        `apps/${projectName}/src/components/app-home/app-home.e2e.ts`,
        `apps/${projectName}/src/components/app-home/app-home.tsx`,
        `apps/${projectName}/src/components/app-home/app-home.${style}`,
        `apps/${projectName}/src/components/app-profile/app-profile.e2e.ts`,
        `apps/${projectName}/src/components/app-profile/app-profile.tsx`,
        `apps/${projectName}/src/components/app-profile/app-profile.spec.ts`,
        `apps/${projectName}/src/components/app-profile/app-profile.${style}`,
        `apps/${projectName}/src/components/app-root/app-root.e2e.ts`,
        `apps/${projectName}/src/components/app-root/app-root.tsx`,
        `apps/${projectName}/src/components/app-root/app-root.${style}`,
      ];
    }

    if (projectType == 'library') {
      return [
        `libs/${projectName}/stencil.config.ts`,
        `libs/${projectName}/tsconfig.json`,
        `libs/${projectName}/src/components/my-component/my-component.e2e.ts`,
        `libs/${projectName}/src/components/my-component/my-component.spec.ts`,
        `libs/${projectName}/src/components/my-component/my-component.tsx`,
        `libs/${projectName}/src/components/my-component/my-component.${style}`,
        `libs/${projectName}/src/utils/utils.spec.ts`,
        `libs/${projectName}/src/utils/utils.ts`,
      ];
    }
  } else {
    if (projectType == 'application') {
      return [
        `apps/${subDirectory}/${projectName}/src/global/app.${style}`,
        `apps/${subDirectory}/${projectName}/src/global/app.ts`,
        `apps/${subDirectory}/${projectName}/stencil.config.ts`,
        `apps/${subDirectory}/${projectName}/tsconfig.json`,
        `apps/${subDirectory}/${projectName}/src/components/app-home/app-home.e2e.ts`,
        `apps/${subDirectory}/${projectName}/src/components/app-home/app-home.tsx`,
        `apps/${subDirectory}/${projectName}/src/components/app-home/app-home.${style}`,
        `apps/${subDirectory}/${projectName}/src/components/app-profile/app-profile.e2e.ts`,
        `apps/${subDirectory}/${projectName}/src/components/app-profile/app-profile.tsx`,
        `apps/${subDirectory}/${projectName}/src/components/app-profile/app-profile.spec.ts`,
        `apps/${subDirectory}/${projectName}/src/components/app-profile/app-profile.${style}`,
        `apps/${subDirectory}/${projectName}/src/components/app-root/app-root.e2e.ts`,
        `apps/${subDirectory}/${projectName}/src/components/app-root/app-root.tsx`,
        `apps/${subDirectory}/${projectName}/src/components/app-root/app-root.${style}`,
      ];
    }

    if (projectType == 'library') {
      return [
        `libs/${subDirectory}/${projectName}/stencil.config.ts`,
        `libs/${subDirectory}/${projectName}/tsconfig.json`,
        `libs/${subDirectory}/${projectName}/src/components/my-component/my-component.e2e.ts`,
        `libs/${subDirectory}/${projectName}/src/components/my-component/my-component.spec.ts`,
        `libs/${subDirectory}/${projectName}/src/components/my-component/my-component.tsx`,
        `libs/${subDirectory}/${projectName}/src/components/my-component/my-component.${style}`,
        `libs/${subDirectory}/${projectName}/src/utils/utils.spec.ts`,
        `libs/${subDirectory}/${projectName}/src/utils/utils.ts`,
      ];
    }
  }
}
