import { projectRootDir, ProjectType } from '@nrwl/workspace';
import { checkFilesExist, readJson } from '@nrwl/nx-plugin/testing';
import { normalize } from '@angular-devkit/core';

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
          normalize(`${projectRootDir(projectType)}/${projectName}/src/global/app.${style}`),
          normalize(`${projectRootDir(projectType)}/${projectName}/src/global/app.ts`)
        ),
          checkFilesExist(
            normalize(`${projectRootDir(projectType)}/${projectName}/stencil.config.ts`),
            normalize(`${projectRootDir(projectType)}/${projectName}/tsconfig.json`),
            normalize(`${projectRootDir(projectType)}/${projectName}/src/components/app-home/app-home.e2e.ts`),
            normalize(`${projectRootDir(projectType)}/${projectName}/src/components/app-home/app-home.tsx`),
            normalize(`${projectRootDir(projectType)}/${projectName}/src/components/app-home/app-home.${style}`),
            normalize(`${projectRootDir(projectType)}/${projectName}/src/components/app-profile/app-profile.e2e.ts`),
            normalize(`${projectRootDir(projectType)}/${projectName}/src/components/app-profile/app-profile.tsx`),
            normalize(`${projectRootDir(projectType)}/${projectName}/src/components/app-profile/app-profile.spec.ts`),
            normalize(`${projectRootDir(projectType)}/${projectName}/src/components/app-profile/app-profile.${style}`),
            normalize(`${projectRootDir(projectType)}/${projectName}/src/components/app-root/app-root.e2e.ts`),
            normalize(`${projectRootDir(projectType)}/${projectName}/src/components/app-root/app-root.tsx`),
            normalize(`${projectRootDir(projectType)}/${projectName}/src/components/app-root/app-root.${style}`)
          );
      }).not.toThrow();
    }

    if (projectType == ProjectType.Library) {
      // prettier-ignore
      expect(() => {
        checkFilesExist(
          normalize(`${projectRootDir(projectType)}/${projectName}/stencil.config.ts`),
          normalize(`${projectRootDir(projectType)}/${projectName}/tsconfig.json`),
          normalize(`${projectRootDir(projectType)}/${projectName}/src/components/my-component/my-component.e2e.ts`),
          normalize(`${projectRootDir(projectType)}/${projectName}/src/components/my-component/my-component.spec.ts`),
          normalize(`${projectRootDir(projectType)}/${projectName}/src/components/my-component/my-component.tsx`),
          normalize(`${projectRootDir(projectType)}/${projectName}/src/components/my-component/my-component.${style}`),
          normalize(`${projectRootDir(projectType)}/${projectName}/src/utils/utils.spec.ts`),
          normalize(`${projectRootDir(projectType)}/${projectName}/src/utils/utils.ts`)
        );
      }).not.toThrow();
    }

    const workspaceJson = readJson('workspace.json');
    expect(
      workspaceJson.projects[projectName].architect.build.options.configPath
    ).toBe(
      normalize(
        `${projectRootDir(projectType)}/${projectName}/stencil.config.ts`
      )
    );
    expect(
      workspaceJson.projects[projectName].architect.test.options.configPath
    ).toBe(
      normalize(
        `${projectRootDir(projectType)}/${projectName}/stencil.config.ts`
      )
    );
    expect(
      workspaceJson.projects[projectName].architect.e2e.options.configPath
    ).toBe(
      normalize(
        `${projectRootDir(projectType)}/${projectName}/stencil.config.ts`
      )
    );
  } else {
    if (projectType == ProjectType.Application) {
      // prettier-ignore
      expect(() => {
        checkFilesExist(
          normalize(`${projectRootDir(projectType)}/${subDirectory}/${projectName}/src/global/app.${style}`),
          normalize(`${projectRootDir(projectType)}/${subDirectory}/${projectName}/src/global/app.ts`)
        ),
          checkFilesExist(
            normalize(`${projectRootDir(projectType)}/${subDirectory}/${projectName}/stencil.config.ts`),
            normalize(`${projectRootDir(projectType)}/${subDirectory}/${projectName}/tsconfig.json`),
            normalize(`${projectRootDir(projectType)}/${subDirectory}/${projectName}/src/components/app-home/app-home.e2e.ts`),
            normalize(`${projectRootDir(projectType)}/${subDirectory}/${projectName}/src/components/app-home/app-home.tsx`),
            normalize(`${projectRootDir(projectType)}/${subDirectory}/${projectName}/src/components/app-home/app-home.${style}`),
            normalize(`${projectRootDir(projectType)}/${subDirectory}/${projectName}/src/components/app-profile/app-profile.e2e.ts`),
            normalize(`${projectRootDir(projectType)}/${subDirectory}/${projectName}/src/components/app-profile/app-profile.tsx`),
            normalize(`${projectRootDir(projectType)}/${subDirectory}/${projectName}/src/components/app-profile/app-profile.spec.ts`),
            normalize(`${projectRootDir(projectType)}/${subDirectory}/${projectName}/src/components/app-profile/app-profile.${style}`),
            normalize(`${projectRootDir(projectType)}/${subDirectory}/${projectName}/src/components/app-root/app-root.e2e.ts`),
            normalize(`${projectRootDir(projectType)}/${subDirectory}/${projectName}/src/components/app-root/app-root.tsx`),
            normalize(`${projectRootDir(projectType)}/${subDirectory}/${projectName}/src/components/app-root/app-root.${style}`)
          );
      }).not.toThrow();
    }

    if (projectType == ProjectType.Library) {
      // prettier-ignore
      expect(() => {
        checkFilesExist(
          normalize(`${projectRootDir(projectType)}/${subDirectory}/${projectName}/stencil.config.ts`),
          normalize(`${projectRootDir(projectType)}/${subDirectory}/${projectName}/tsconfig.json`),
          normalize(`${projectRootDir(projectType)}/${subDirectory}/${projectName}/src/components/my-component/my-component.e2e.ts`),
          normalize(`${projectRootDir(projectType)}/${subDirectory}/${projectName}/src/components/my-component/my-component.spec.ts`),
          normalize(`${projectRootDir(projectType)}/${subDirectory}/${projectName}/src/components/my-component/my-component.tsx`),
          normalize(`${projectRootDir(projectType)}/${subDirectory}/${projectName}/src/components/my-component/my-component.${style}`),
          normalize(`${projectRootDir(projectType)}/${subDirectory}/${projectName}/src/utils/utils.spec.ts`),
          normalize(`${projectRootDir(projectType)}/${subDirectory}/${projectName}/src/utils/utils.ts`)
        );
      }).not.toThrow();
    }

    const workspaceJson = readJson('workspace.json');
    expect(
      workspaceJson.projects[projectName].architect.build.options.configPath
    ).toBe(
      normalize(
        `${projectRootDir(
          projectType
        )}/${subDirectory}/${projectName}/stencil.config.ts`
      )
    );
    expect(
      workspaceJson.projects[projectName].architect.test.options.configPath
    ).toBe(
      normalize(
        `${projectRootDir(
          projectType
        )}/${subDirectory}/${projectName}/stencil.config.ts`
      )
    );
    expect(
      workspaceJson.projects[projectName].architect.e2e.options.configPath
    ).toBe(
      normalize(
        `${projectRootDir(
          projectType
        )}/${subDirectory}/${projectName}/stencil.config.ts`
      )
    );
  }
}
