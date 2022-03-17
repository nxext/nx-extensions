import { Storage } from '@nxextjs/storage';
export * from './provider/base-provider';
export * from './provider/storage-provider';
export * from './interfaces/cache-provider';

interface NxextJs {
  cache: Storage;
}

export const nxextJs: NxextJs = {} as NxextJs;
