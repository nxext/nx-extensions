import type { Storage } from '@nxextjs/storage';

export interface CacheDecoratorOptions {
  type: Storage;
  ttl: number;
}
