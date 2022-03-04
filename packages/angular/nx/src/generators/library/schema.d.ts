import { Linter } from '@nrwl/linter';
import { UnitTestRunner } from '@nrwl/angular/src/utils/test-runners';
type AngularLinter = Exclude<Linter, Linter.TsLint>;

export interface Schema {
  name: string;
  addTailwind?: boolean;
  skipFormat?: boolean;
  simpleModuleName?: boolean;
  addModuleSpec?: boolean;
  directory?: string;
  sourceDir?: string;
  buildable?: boolean;
  publishable?: boolean;
  importPath?: string;
  standaloneConfig?: boolean;
  spec?: boolean;
  flat?: boolean;
  commonModule?: boolean;
  prefix?: string;
  routing?: boolean;
  lazy?: boolean;
  parentModule?: string;
  tags?: string;
  strict?: boolean;
  linter?: AngularLinter;
  unitTestRunner?: UnitTestRunner;
  compilationMode?: 'full' | 'partial';
  setParserOptionsProject?: boolean;
}
