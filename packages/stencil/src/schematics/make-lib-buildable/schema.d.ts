import { SupportedStyles } from '../../utils/typings';
import { InitSchema } from '../init/schema';

export interface MakeLibBuildableSchema extends InitSchema {
  style: SupportedStyles;
}
