import { normalizePath } from './normalize-path';

describe('normalizePath', () => {
  it('leaves an absolute POSIX path unchanged', () => {
    expect(normalizePath('/foo/bar')).toBe('/foo/bar');
  });

  it('converts backslashes to forward slashes', () => {
    expect(normalizePath('foo\\bar')).toBe('./foo/bar');
  });

  it('collapses "." segments', () => {
    expect(normalizePath('./foo/./bar')).toBe('./foo/bar');
  });

  it('resolves ".." segments against the preceding component', () => {
    expect(normalizePath('foo/../bar')).toBe('./bar');
  });

  it('leaves a bare relative segment (no slash) unprefixed', () => {
    expect(normalizePath('foo')).toBe('foo');
  });

  it('does not add a "./" prefix to a package-scope-like path (@scope/pkg)', () => {
    expect(normalizePath('@nxext/stencil')).toBe('@nxext/stencil');
  });

  it('adds an explicit "./" prefix to a plain relative directory path', () => {
    expect(normalizePath('foo/bar')).toBe('./foo/bar');
  });

  it('strips a trailing slash', () => {
    expect(normalizePath('foo/')).toBe('./foo');
  });

  it('normalizes an empty string to "."', () => {
    expect(normalizePath('')).toBe('.');
  });

  it('preserves a UNC path', () => {
    expect(normalizePath('//server/share')).toBe('//server/share');
  });

  it('preserves a DOS drive path', () => {
    expect(normalizePath('C:/foo')).toBe('C:/foo');
  });

  it('trims surrounding whitespace before normalizing', () => {
    expect(normalizePath('  foo/bar  ')).toBe('./foo/bar');
  });

  it('throws for a non-string input', () => {
    expect(() => normalizePath(null as unknown as string)).toThrow(
      'invalid path to normalize'
    );
  });
});
