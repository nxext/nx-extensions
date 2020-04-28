import { projectRootDir, ProjectType } from '@nrwl/workspace';
import { checkFilesExist } from '@nrwl/nx-plugin/testing';

export function testProject(
  plugin: string,
  style: string,
  projectType: ProjectType
) {
  if (projectType == ProjectType.Application) {
    // prettier-ignore
    expect(() => {
      checkFilesExist(
        `${projectRootDir(projectType)}/${plugin}/src/global/app.${style}`,
        `${projectRootDir(projectType)}/${plugin}/src/global/app.ts`
      ),
        checkFilesExist(
          `${projectRootDir(projectType)}/${plugin}/stencil.config.ts`,
          `${projectRootDir(projectType)}/${plugin}/tsconfig.json`,
          `${projectRootDir(projectType)}/${plugin}/src/components/app-home/app-home.e2e.ts`,
          `${projectRootDir(projectType)}/${plugin}/src/components/app-home/app-home.tsx`,
          `${projectRootDir(projectType)}/${plugin}/src/components/app-home/app-home.${style}`,
          `${projectRootDir(projectType)}/${plugin}/src/components/app-profile/app-profile.e2e.ts`,
          `${projectRootDir(projectType)}/${plugin}/src/components/app-profile/app-profile.tsx`,
          `${projectRootDir(projectType)}/${plugin}/src/components/app-profile/app-profile.spec.ts`,
          `${projectRootDir(projectType)}/${plugin}/src/components/app-profile/app-profile.${style}`,
          `${projectRootDir(projectType)}/${plugin}/src/components/app-root/app-root.e2e.ts`,
          `${projectRootDir(projectType)}/${plugin}/src/components/app-root/app-root.tsx`,
          `${projectRootDir(projectType)}/${plugin}/src/components/app-root/app-root.${style}`
        );
    }).not.toThrow();
  }

  if (projectType == ProjectType.Library) {
    // prettier-ignore
    expect(() => {
      checkFilesExist(
        `${projectRootDir(projectType)}/${plugin}/stencil.config.ts`,
        `${projectRootDir(projectType)}/${plugin}/tsconfig.json`,
        `${projectRootDir(projectType)}/${plugin}/src/components/my-component/my-component.e2e.ts`,
        `${projectRootDir(projectType)}/${plugin}/src/components/my-component/my-component.spec.ts`,
        `${projectRootDir(projectType)}/${plugin}/src/components/my-component/my-component.tsx`,
        `${projectRootDir(projectType)}/${plugin}/src/components/my-component/my-component.${style}`,
        `${projectRootDir(projectType)}/${plugin}/src/utils/utils.spec.ts`,
        `${projectRootDir(projectType)}/${plugin}/src/utils/utils.ts`
      );
    }).not.toThrow();
  }
}
