import { Linter } from '@nrwl/linter';
import {
  E2eTestRunner,
  UnitTestRunner,
} from '@nrwl/angular/src/utils/test-runners';
import type { Styles } from '@nrwl/angular/src/generators/utils/types';

type AngularLinter = Exclude<Linter, Linter.TsLint>;

export interface Schema {
  name: string;
  skipFormat?: boolean;
  inlineStyle?: boolean;
  inlineTemplate?: boolean;
  viewEncapsulation?: 'Emulated' | 'Native' | 'None';
  routing?: boolean;
  prefix?: string;
  style?: Styles;
  skipTests?: boolean;
  directory?: string;
  tags?: string;
  linter?: AngularLinter;
  unitTestRunner?: UnitTestRunner;
  backendProject?: string;
  strict?: boolean;
  standaloneConfig?: boolean;
  mfe?: boolean;
  mfeType?: 'host' | 'remote';
  remotes?: string[];
  port?: number;
  host?: string;
  setParserOptionsProject?: boolean;
}
