import { mkdtempSync, rmSync, existsSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { prepareE2eTesting, cleanupE2eTesting } from './e2e-testing';
import { PathCollection } from './types';

describe('e2e-testing', () => {
  let projectRoot: string;
  let pathCollection: PathCollection;

  beforeEach(() => {
    projectRoot = mkdtempSync(join(tmpdir(), 'stencil-e2e-testing-'));
    pathCollection = {
      projectName: 'my-lib',
      projectRoot,
      distDir: join(projectRoot, 'dist'),
      pkgJson: join(projectRoot, 'package.json'),
    };
  });

  afterEach(() => {
    rmSync(projectRoot, { recursive: true, force: true });
  });

  describe('prepareE2eTesting', () => {
    it('writes a package.e2e.json with dist-relative field paths', () => {
      prepareE2eTesting(pathCollection);

      const pkgPath = join(projectRoot, 'package.e2e.json');
      expect(existsSync(pkgPath)).toBe(true);

      const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8'));
      expect(pkg.name).toBe('my-lib');
      expect(pkg.main).toBe('dist/dist/index.cjs.js');
      expect(pkg.module).toBe('dist/dist/index.js');
      expect(pkg.types).toBe('dist/dist/types/index.d.ts');
      expect(pkg.collection).toBe(
        'dist/dist/collection/collection-manifest.json'
      );
      expect(pkg['collection:main']).toBe('dist/dist/collection/index.js');
      expect(pkg.unpkg).toBe('dist/dist/my-lib/my-lib.js');
      expect(pkg.files).toEqual(['dist/dist/', 'dist/loader/']);
    });
  });

  describe('cleanupE2eTesting', () => {
    it('deletes an existing package.e2e.json', () => {
      prepareE2eTesting(pathCollection);
      expect(existsSync(join(projectRoot, 'package.e2e.json'))).toBe(true);

      cleanupE2eTesting(pathCollection);

      expect(existsSync(join(projectRoot, 'package.e2e.json'))).toBe(false);
    });

    it('is a no-op when package.e2e.json does not exist', () => {
      expect(() => cleanupE2eTesting(pathCollection)).not.toThrow();
    });
  });
});
