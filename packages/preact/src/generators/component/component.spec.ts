import { componentGenerator, PreactComponentSchema } from './component';
import { createTestProject } from '../utils/testing';
import { uniq } from '@nx/plugin/testing';
import { names, Tree } from '@nx/devkit';

describe('component schematic', () => {
  let tree: Tree;
  const projectName = uniq('testprojekt');
  const projectAppDirectory = `apps/${projectName}`;
  const projectLibDirectory = `libs/${projectName}`;
  const componentName = uniq('test');
  const options: PreactComponentSchema = {
    name: componentName,
    project: projectName,
    unitTestRunner: 'jest',
  };

  it('should run successfully', async () => {
    tree = await createTestProject(projectAppDirectory);
    await expect(componentGenerator(tree, options)).resolves.not.toThrowError();
  });

  it('should add file', async () => {
    tree = await createTestProject(projectAppDirectory);
    await componentGenerator(tree, options);
    const name = names(componentName);
    expect(
      tree.exists(
        `${projectAppDirectory}/src/components/${name.fileName}/${name.className}.ts`
      )
    );
  });

  it('generates a spec that mounts the component and needs no @testing-library/jest-dom', async () => {
    tree = await createTestProject(projectAppDirectory);
    await componentGenerator(tree, options);
    const name = names(componentName);

    const specFile = tree
      .read(
        `${projectAppDirectory}/src/components/${name.fileName}/${name.fileName}.spec.tsx`
      )
      .toString('utf-8');
    // Regression guard (found by the ts-solution e2e, but mode-independent):
    // the template used to side-effect-import @testing-library/jest-dom
    // without using any of its matchers and without any generator ever
    // installing it - vitest then failed to resolve the import at runtime.
    expect(specFile).not.toContain('@testing-library/jest-dom');
    // ...and it used to pass the bare component function to render(), which
    // preact ignores (function children are nulled), so nothing was mounted
    // and getByText could never succeed.
    expect(specFile).toContain(`render(h(${name.className}, null))`);
  });

  it('should add file to barrel', async () => {
    tree = await createTestProject(projectLibDirectory, 'library');
    await componentGenerator(tree, options);
    const name = names(componentName);

    const indexFile = tree.read(`${projectLibDirectory}/src/index.ts`);
    expect(indexFile.toString('utf-8')).toMatch(
      `export { default as ${name.className} } from './components/${name.fileName}/${name.className}.ts';`
    );
  });
});
