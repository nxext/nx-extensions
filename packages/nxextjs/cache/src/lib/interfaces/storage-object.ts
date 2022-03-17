import { CacheReturnType } from '../enum/cache-return-type';

export type StorageObject = {
  items: { [args: string]: unknown };
  ttl: { [args: string]: number };
  returnType?: CacheReturnType;
};
