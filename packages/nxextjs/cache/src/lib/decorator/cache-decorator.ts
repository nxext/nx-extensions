import { CacheDecoratorOptions } from './interfaces/cache-decorator-options';
import { Storage, InMemoryCache } from '@nxextjs/storage';
import { StorageProvider } from '../provider/storage-provider.ts';
import { liberty } from '../mod.ts';
import { CacheService } from '../cache-service.ts';

export function Cache(
  _options: CacheDecoratorOptions = {
    type: undefined as unknown as Storage,
    ttl: 0,
  }
): MethodDecorator {
  // first we set type if none is provided
  if (!_options.type) {
    liberty.cache = liberty.cache || new InMemoryCache();
    _options.type = liberty.cache;
  }

  const provider: StorageProvider = new StorageProvider({
    ttl: _options.ttl,
    type: _options.type,
  });
  const memoize: CacheService = new CacheService(provider);
  return (
    target: object,
    method: string | Symbol,
    descriptor: PropertyDescriptor
  ): PropertyDescriptor => {
    if (descriptor && descriptor.hasOwnProperty('get') && descriptor.get) {
      descriptor.get = function (this: Function, ...args: any[]): any {
        return memoize.getValue(JSON.stringify(args));
      };
      const originalSet: Function = descriptor.set?.bind(target) as Function;
      descriptor.set = function (this: Function, ...args: any[]): void {
        originalSet.call(this, ...args);
        return memoize.setValue(JSON.stringify([]), args[0]);
      };
    } else if (!descriptor.hasOwnProperty('set') && descriptor.value) {
      const originalMethod = descriptor.value.bind(target);
      descriptor.value = function (this: Function, ...args: any[]): any {
        return memoize.forMethod(originalMethod, args);
      };
    } else {
      throw new Error("Can't set cache decorator on a setter");
    }
    return descriptor;
  };
}
