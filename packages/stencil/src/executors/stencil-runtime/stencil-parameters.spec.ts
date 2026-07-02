import { parseRunParameters } from './stencil-parameters';
import { StencilBaseConfigOptions } from './stencil-config';

describe('parseRunParameters', () => {
  it('appends a bare flag for truthy boolean options', () => {
    const options = { watch: true } as unknown as StencilBaseConfigOptions;
    expect(parseRunParameters([], options)).toEqual(['--watch']);
  });

  it('omits falsy boolean options entirely', () => {
    const options = { watch: false } as unknown as StencilBaseConfigOptions;
    expect(parseRunParameters([], options)).toEqual([]);
  });

  it('appends --key=value for truthy non-boolean options', () => {
    const options = {
      configPath: 'stencil.config.ts',
      outputPath: 'dist/apps/my-app',
    } as unknown as StencilBaseConfigOptions;
    expect(parseRunParameters([], options)).toEqual([
      '--configPath=stencil.config.ts',
      '--outputPath=dist/apps/my-app',
    ]);
  });

  it('omits falsy non-boolean options (empty string, undefined, 0)', () => {
    const options = {
      configPath: '',
      tsConfig: undefined,
      maxWorkers: 0,
    } as unknown as StencilBaseConfigOptions;
    expect(parseRunParameters([], options)).toEqual([]);
  });

  it('appends onto an existing runOptions array rather than replacing it', () => {
    const options = { dev: true } as unknown as StencilBaseConfigOptions;
    expect(parseRunParameters(['--existing'], options)).toEqual([
      '--existing',
      '--dev',
    ]);
  });
});
