import { Tree, updateJson } from '@nx/devkit';
import { NormalizedSchema } from '../schema';

export function updateEslintConfig(host: Tree, options: NormalizedSchema) {
  updateJson(host, `${options.appProjectRoot}/.eslintrc.json`, (json) => {
    const tsOverride =
      json.overrides?.find((override: { files: string | string[] }) =>
        override.files.includes('*.ts')
      ) || {};
    tsOverride.rules = tsOverride?.rules || {};
    tsOverride.rules['@angular-eslint/component-class-suffix'] = [
      'error',
      {
        suffixes: ['Page', 'Component'],
      },
    ];
    tsOverride.rules['@angular-eslint/no-empty-lifecycle-method'] = 0;
    tsOverride.rules['@typescript-eslint/no-empty-function'] = 0;
    return json;
  });
}
