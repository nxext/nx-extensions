import { join } from 'path';
import { createEmptyWorkspace } from '@nrwl/workspace/testing';
import { externalSchematic, Rule, Tree } from '@angular-devkit/schematics';
import { SchematicTestRunner } from '@angular-devkit/schematics/testing';
import { ProjectType } from '@nrwl/workspace';
import { SupportedStyles } from '../stencil-core-utils';

const testRunner = new SchematicTestRunner(
  '@nxext/stencil',
  join(__dirname, '../../collection.json')
);

const migrationRunner = new SchematicTestRunner(
  '@nxext/stencil',
  join(__dirname, '../../migrations.json')
);

export function callRule(rule: Rule, tree: Tree) {
  return testRunner.callRule(rule, tree).toPromise();
}

export function runMigration(migrationName: string, options: any, tree: Tree) {
  return migrationRunner
    .runSchematicAsync(migrationName, options, tree)
    .toPromise();
}

export async function createTestUILib(
  libName: string,
  style: SupportedStyles = SupportedStyles.css,
  buildable = true
): Promise<Tree> {
  let appTree = createEmptyWorkspace(Tree.empty());
  appTree = await callRule(
    externalSchematic('@nxext/stencil', 'library', {
      name: libName,
      style: style,
      buildable,
    }),
    appTree
  );

  return appTree;
}

export function fileListForAppType(
  projectName: string,
  style: string,
  projectType: ProjectType,
  subDirectory?: string
): string[] {
  if (!subDirectory) {
    if (projectType == ProjectType.Application) {
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

    if (projectType == ProjectType.Library) {
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
    if (projectType == ProjectType.Application) {
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

    if (projectType == ProjectType.Library) {
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
