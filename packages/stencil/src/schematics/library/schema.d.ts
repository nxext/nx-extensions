import { AppType } from './../../utils/typings';
import { InitSchema } from '../init/schema';
import { MakeLibBuildableSchema } from '../make-lib-buildable/schema';

export interface LibrarySchema extends InitSchema, MakeLibBuildableSchema {
  projectName: string;
  projectRoot: string;
  projectDirectory: string;
  parsedTags: string[];
  buildable: boolean;
  appType: AppType;
}
