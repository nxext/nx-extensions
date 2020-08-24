import { projectRootDir, ProjectType } from '@nrwl/workspace';
import { checkFilesExist, readJson, runYarnInstall, tmpProjPath } from '@nrwl/nx-plugin/testing';
import { normalize } from '@angular-devkit/core';
import { readFileSync, writeFileSync } from 'fs';

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
          normalize(`apps/${projectName}/src/global/app.${style}`),
          normalize(`apps/${projectName}/src/global/app.ts`)
        ),
          checkFilesExist(
            normalize(`apps/${projectName}/stencil.config.ts`),
            normalize(`apps/${projectName}/tsconfig.json`),
            normalize(`apps/${projectName}/src/components/app-home/app-home.e2e.ts`),
            normalize(`apps/${projectName}/src/components/app-home/app-home.tsx`),
            normalize(`apps/${projectName}/src/components/app-home/app-home.${style}`),
            normalize(`apps/${projectName}/src/components/app-profile/app-profile.e2e.ts`),
            normalize(`apps/${projectName}/src/components/app-profile/app-profile.tsx`),
            normalize(`apps/${projectName}/src/components/app-profile/app-profile.spec.ts`),
            normalize(`apps/${projectName}/src/components/app-profile/app-profile.${style}`),
            normalize(`apps/${projectName}/src/components/app-root/app-root.e2e.ts`),
            normalize(`apps/${projectName}/src/components/app-root/app-root.tsx`),
            normalize(`apps/${projectName}/src/components/app-root/app-root.${style}`)
          );
      }).not.toThrow();
    }

    if (projectType == ProjectType.Library) {
      // prettier-ignore
      expect(() => {
        checkFilesExist(
          normalize(`libs/${projectName}/stencil.config.ts`),
          normalize(`libs/${projectName}/tsconfig.json`),
          normalize(`libs/${projectName}/src/components/my-component/my-component.e2e.ts`),
          normalize(`libs/${projectName}/src/components/my-component/my-component.spec.ts`),
          normalize(`libs/${projectName}/src/components/my-component/my-component.tsx`),
          normalize(`libs/${projectName}/src/components/my-component/my-component.${style}`),
          normalize(`libs/${projectName}/src/utils/utils.spec.ts`),
          normalize(`libs/${projectName}/src/utils/utils.ts`)
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
        )}/${projectName}/stencil.config.ts`
      )
    );
    expect(
      workspaceJson.projects[projectName].architect.test.options.configPath
    ).toBe(
      normalize(
        `${projectRootDir(
          projectType
        )}/${projectName}/stencil.config.ts`
      )
    );
    expect(
      workspaceJson.projects[projectName].architect.e2e.options.configPath
    ).toBe(
      normalize(
        `${projectRootDir(
          projectType
        )}/${projectName}/stencil.config.ts`
      )
    );
  } else {
    if (projectType == ProjectType.Application) {
      // prettier-ignore
      expect(() => {
        checkFilesExist(
          normalize(`apps/${subDirectory}/${projectName}/src/global/app.${style}`),
          normalize(`apps/${subDirectory}/${projectName}/src/global/app.ts`)
        ),
          checkFilesExist(
            normalize(`apps/${subDirectory}/${projectName}/stencil.config.ts`),
            normalize(`apps/${subDirectory}/${projectName}/tsconfig.json`),
            normalize(`apps/${subDirectory}/${projectName}/src/components/app-home/app-home.e2e.ts`),
            normalize(`apps/${subDirectory}/${projectName}/src/components/app-home/app-home.tsx`),
            normalize(`apps/${subDirectory}/${projectName}/src/components/app-home/app-home.${style}`),
            normalize(`apps/${subDirectory}/${projectName}/src/components/app-profile/app-profile.e2e.ts`),
            normalize(`apps/${subDirectory}/${projectName}/src/components/app-profile/app-profile.tsx`),
            normalize(`apps/${subDirectory}/${projectName}/src/components/app-profile/app-profile.spec.ts`),
            normalize(`apps/${subDirectory}/${projectName}/src/components/app-profile/app-profile.${style}`),
            normalize(`apps/${subDirectory}/${projectName}/src/components/app-root/app-root.e2e.ts`),
            normalize(`apps/${subDirectory}/${projectName}/src/components/app-root/app-root.tsx`),
            normalize(`apps/${subDirectory}/${projectName}/src/components/app-root/app-root.${style}`)
          );
      }).not.toThrow();
    }

    if (projectType == ProjectType.Library) {
      // prettier-ignore
      expect(() => {
        checkFilesExist(
          normalize(`libs/${subDirectory}/${projectName}/stencil.config.ts`),
          normalize(`libs/${subDirectory}/${projectName}/tsconfig.json`),
          normalize(`libs/${subDirectory}/${projectName}/src/components/my-component/my-component.e2e.ts`),
          normalize(`libs/${subDirectory}/${projectName}/src/components/my-component/my-component.spec.ts`),
          normalize(`libs/${subDirectory}/${projectName}/src/components/my-component/my-component.tsx`),
          normalize(`libs/${subDirectory}/${projectName}/src/components/my-component/my-component.${style}`),
          normalize(`libs/${subDirectory}/${projectName}/src/utils/utils.spec.ts`),
          normalize(`libs/${subDirectory}/${projectName}/src/utils/utils.ts`)
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

export function addPackageBeforeTest(pkgName, pkgVersion) {
    const packageJson = JSON.parse(readFileSync(tmpProjPath('package.json')).toString());
    packageJson.devDependencies[pkgName] = pkgVersion;
    writeFileSync(tmpProjPath('package.json'), JSON.stringify(packageJson, null, 2));
    runYarnInstall();
}