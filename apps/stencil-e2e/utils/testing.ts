import { projectRootDir, ProjectType } from '@nrwl/workspace';
import { checkFilesExist, readJson } from '@nrwl/nx-plugin/testing';

export function testProject(
  projectName: string,
  style: string,
  projectType: ProjectType,
  subDirectory?: string
) {
  if (!subDirectory) {
    if (projectType == ProjectType.Application) {
      // prettier-ignore
      expect(() => {
        checkFilesExist(
          `${projectRootDir(projectType)}/${projectName}/src/global/app.${style}`,
          `${projectRootDir(projectType)}/${projectName}/src/global/app.ts`
        ),
          checkFilesExist(
            `${projectRootDir(projectType)}/${projectName}/stencil.config.ts`,
            `${projectRootDir(projectType)}/${projectName}/tsconfig.json`,
            `${projectRootDir(projectType)}/${projectName}/src/components/app-home/app-home.e2e.ts`,
            `${projectRootDir(projectType)}/${projectName}/src/components/app-home/app-home.tsx`,
            `${projectRootDir(projectType)}/${projectName}/src/components/app-home/app-home.${style}`,
            `${projectRootDir(projectType)}/${projectName}/src/components/app-profile/app-profile.e2e.ts`,
            `${projectRootDir(projectType)}/${projectName}/src/components/app-profile/app-profile.tsx`,
            `${projectRootDir(projectType)}/${projectName}/src/components/app-profile/app-profile.spec.ts`,
            `${projectRootDir(projectType)}/${projectName}/src/components/app-profile/app-profile.${style}`,
            `${projectRootDir(projectType)}/${projectName}/src/components/app-root/app-root.e2e.ts`,
            `${projectRootDir(projectType)}/${projectName}/src/components/app-root/app-root.tsx`,
            `${projectRootDir(projectType)}/${projectName}/src/components/app-root/app-root.${style}`
          );
      }).not.toThrow();
    }

    if (projectType == ProjectType.Library) {
      // prettier-ignore
      expect(() => {
        checkFilesExist(
          `${projectRootDir(projectType)}/${projectName}/stencil.config.ts`,
          `${projectRootDir(projectType)}/${projectName}/tsconfig.json`,
          `${projectRootDir(projectType)}/${projectName}/src/components/my-component/my-component.e2e.ts`,
          `${projectRootDir(projectType)}/${projectName}/src/components/my-component/my-component.spec.ts`,
          `${projectRootDir(projectType)}/${projectName}/src/components/my-component/my-component.tsx`,
          `${projectRootDir(projectType)}/${projectName}/src/components/my-component/my-component.${style}`,
          `${projectRootDir(projectType)}/${projectName}/src/utils/utils.spec.ts`,
          `${projectRootDir(projectType)}/${projectName}/src/utils/utils.ts`
        );
      }).not.toThrow();
    }
  } else {
    if (projectType == ProjectType.Application) {
      // prettier-ignore
      expect(() => {
        checkFilesExist(
          `${projectRootDir(projectType)}/${projectName}/src/global/app.${style}`,
          `${projectRootDir(projectType)}/${subDirectory}/${projectName}/src/global/app.ts`
        ),
          checkFilesExist(
            `${projectRootDir(projectType)}/${projectName}/stencil.config.ts`,
            `${projectRootDir(projectType)}/${subDirectory}/${projectName}/tsconfig.json`,
            `${projectRootDir(projectType)}/${subDirectory}/${projectName}/src/components/app-home/app-home.e2e.ts`,
            `${projectRootDir(projectType)}/${subDirectory}/${projectName}/src/components/app-home/app-home.tsx`,
            `${projectRootDir(projectType)}/${subDirectory}/${projectName}/src/components/app-home/app-home.${style}`,
            `${projectRootDir(projectType)}/${subDirectory}/${projectName}/src/components/app-profile/app-profile.e2e.ts`,
            `${projectRootDir(projectType)}/${subDirectory}/${projectName}/src/components/app-profile/app-profile.tsx`,
            `${projectRootDir(projectType)}/${subDirectory}/${projectName}/src/components/app-profile/app-profile.spec.ts`,
            `${projectRootDir(projectType)}/${subDirectory}/${projectName}/src/components/app-profile/app-profile.${style}`,
            `${projectRootDir(projectType)}/${subDirectory}/${projectName}/src/components/app-root/app-root.e2e.ts`,
            `${projectRootDir(projectType)}/${subDirectory}/${projectName}/src/components/app-root/app-root.tsx`,
            `${projectRootDir(projectType)}/${subDirectory}/${projectName}/src/components/app-root/app-root.${style}`
          );
      }).not.toThrow();
    }

    if (projectType == ProjectType.Library) {
      // prettier-ignore
      expect(() => {
        checkFilesExist(
          `${projectRootDir(projectType)}/${subDirectory}/${projectName}/stencil.config.ts`,
          `${projectRootDir(projectType)}/${subDirectory}/${projectName}/tsconfig.json`,
          `${projectRootDir(projectType)}/${subDirectory}/${projectName}/src/components/my-component/my-component.e2e.ts`,
          `${projectRootDir(projectType)}/${subDirectory}/${projectName}/src/components/my-component/my-component.spec.ts`,
          `${projectRootDir(projectType)}/${subDirectory}/${projectName}/src/components/my-component/my-component.tsx`,
          `${projectRootDir(projectType)}/${subDirectory}/${projectName}/src/components/my-component/my-component.${style}`,
          `${projectRootDir(projectType)}/${subDirectory}/${projectName}/src/utils/utils.spec.ts`,
          `${projectRootDir(projectType)}/${subDirectory}/${projectName}/src/utils/utils.ts`
        );
      }).not.toThrow();
    }
  }

  const workspaceJson = readJson('workspace.json');
  expect(
    workspaceJson.projects[projectName].architect.build.options.configPath
  ).toBe(`${projectRootDir(projectType)}/${projectName}/stencil.config.ts`);
  expect(
    workspaceJson.projects[projectName].architect.test.options.configPath
  ).toBe(`${projectRootDir(projectType)}/${projectName}/stencil.config.ts`);
  expect(
    workspaceJson.projects[projectName].architect.e2e.options.configPath
  ).toBe(`${projectRootDir(projectType)}/${projectName}/stencil.config.ts`);
}
