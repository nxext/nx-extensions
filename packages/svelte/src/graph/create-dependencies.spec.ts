import * as fs from 'fs';
import {
  CreateDependenciesContext,
  DependencyType,
  ProjectConfiguration,
} from '@nx/devkit';

const findProjectFromImportMock = jest.fn();

jest.mock('@nx/js/internal', () => ({
  TargetProjectLocator: jest.fn().mockImplementation(() => ({
    findProjectFromImport: findProjectFromImportMock,
  })),
}));

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { createDependencies } = require('./create-dependencies');

function createContext(
  filesByProject: Record<string, string[]>,
  projects: Record<string, Partial<ProjectConfiguration>>,
): CreateDependenciesContext {
  const projectFileMap = Object.fromEntries(
    Object.entries(filesByProject).map(([project, files]) => [
      project,
      files.map((file) => ({ file, hash: 'hash' })),
    ]),
  );
  const fileMap = { projectFileMap, nonProjectFiles: [] };

  return {
    externalNodes: {},
    projects: projects as Record<string, ProjectConfiguration>,
    nxJsonConfiguration: {},
    fileMap,
    filesToProcess: fileMap,
    workspaceRoot: '/virtual',
  };
}

describe('createDependencies', () => {
  beforeEach(() => {
    findProjectFromImportMock.mockReset();
    jest.spyOn(fs, 'readFileSync').mockReturnValue('');
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('returns no dependencies when there are no files to process', async () => {
    const context = createContext({}, {});

    const result = await createDependencies(undefined, context);

    expect(result).toEqual([]);
    expect(findProjectFromImportMock).not.toHaveBeenCalled();
  });

  it('creates a static dependency for a resolvable import in a .svelte file', async () => {
    jest
      .spyOn(fs, 'readFileSync')
      .mockReturnValue(
        `<script>\n  import Foo from '../../lib1/src/index';\n</script>\n<div>hello</div>\n`,
      );
    findProjectFromImportMock.mockReturnValue('lib1');

    const context = createContext(
      { app1: ['apps/app1/src/App.svelte'] },
      { app1: { root: 'apps/app1' }, lib1: { root: 'libs/lib1' } },
    );

    const result = await createDependencies(undefined, context);

    expect(result).toEqual([
      {
        source: 'app1',
        target: 'lib1',
        sourceFile: 'apps/app1/src/App.svelte',
        type: DependencyType.static,
      },
    ]);
    expect(findProjectFromImportMock).toHaveBeenCalledWith(
      '../../lib1/src/index',
      'apps/app1/src/App.svelte',
    );
  });

  it('creates a dynamic dependency for a resolvable dynamic import', async () => {
    jest
      .spyOn(fs, 'readFileSync')
      .mockReturnValue(
        `<script>\n  const mod = import('../../lib1/src/index');\n</script>\n`,
      );
    findProjectFromImportMock.mockReturnValue('lib1');

    const context = createContext(
      { app1: ['apps/app1/src/App.svelte'] },
      { app1: { root: 'apps/app1' }, lib1: { root: 'libs/lib1' } },
    );

    const result = await createDependencies(undefined, context);

    expect(result).toEqual([
      {
        source: 'app1',
        target: 'lib1',
        sourceFile: 'apps/app1/src/App.svelte',
        type: DependencyType.dynamic,
      },
    ]);
  });

  it('ignores non-.svelte files', async () => {
    const context = createContext(
      { app1: ['apps/app1/src/main.ts'] },
      { app1: { root: 'apps/app1' } },
    );

    const result = await createDependencies(undefined, context);

    expect(result).toEqual([]);
    expect(findProjectFromImportMock).not.toHaveBeenCalled();
  });

  it('ignores imports for which no target project can be resolved', async () => {
    jest
      .spyOn(fs, 'readFileSync')
      .mockReturnValue(
        `<script>\n  import Foo from 'not-a-real-package';\n</script>\n`,
      );
    findProjectFromImportMock.mockReturnValue(null);

    const context = createContext(
      { app1: ['apps/app1/src/App.svelte'] },
      { app1: { root: 'apps/app1' } },
    );

    const result = await createDependencies(undefined, context);

    expect(result).toEqual([]);
  });

  it('does not create an edge from a non-root project into the root project', async () => {
    jest
      .spyOn(fs, 'readFileSync')
      .mockReturnValue(
        `<script>\n  import Foo from '../../root-config';\n</script>\n`,
      );
    findProjectFromImportMock.mockReturnValue('root-project');

    const context = createContext(
      { app1: ['apps/app1/src/App.svelte'] },
      { app1: { root: 'apps/app1' }, 'root-project': { root: '.' } },
    );

    const result = await createDependencies(undefined, context);

    expect(result).toEqual([]);
  });
});
