import { CacheOptions } from '../interfaces/cache-options';
import { ICacheProvider } from '../interfaces/cache-provider';

export abstract class BaseCacheProvider implements ICacheProvider {
  constructor(protected options: CacheOptions) {}
  abstract getCached<T>(key: string): T;
  abstract setCached(key: string, value: unknown): void;
  abstract isExpired(key: string): boolean;
  abstract hasCache(key: string): boolean;
}
