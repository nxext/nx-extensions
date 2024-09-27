import { getEsLintPluginBaseName } from './lint';
import {
  deprecatedStencilEslintPlugin,
  eslintImportPlugin,
  stencilEslintPlugin,
} from './versions';

describe('stencil:utils:lint', () => {
  it('getEsLintPluginBaseName should return correct value', () => {
    const name1 = getEsLintPluginBaseName(stencilEslintPlugin);
    const name2 = getEsLintPluginBaseName(deprecatedStencilEslintPlugin);
    const name3 = getEsLintPluginBaseName(eslintImportPlugin);
    expect(name1).toEqual('@stencil-community');
    expect(name2).toEqual('@stencil');
    expect(name3).toEqual('import');
  });
});
