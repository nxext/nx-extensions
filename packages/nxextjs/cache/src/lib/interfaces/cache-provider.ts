export interface ICacheProvider {
  getCached<T>(key: string): T;
  setCached(key: string, value: unknown): Promise<void> | void;
  isExpired(key: string): boolean;
  hasCache(key: string): boolean;
}
