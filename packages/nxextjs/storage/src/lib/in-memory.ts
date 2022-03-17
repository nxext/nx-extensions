import { Storage } from './interfaces/storage';

export class InMemoryCache implements Storage {
  private storage = {};

  /**
   * Returns the number of key/value pairs currently present in the list associated with the object.
   */
  get length(): number {
    return Object.keys(this.storage).length;
  }
  /**
   * Empties the list associated with the object of all key/value pairs, if there are any.
   */
  clear(): void {
    this.storage = {};
  }
  /**
   * Returns the current value associated with the given key, or null if the given key does not exist in the list associated with the object.
   */
  getItem(key: string): string | null {
    return this.storage[key] || null;
  }
  /**
   * Returns the name of the nth key in the list, or null if n is greater than or equal to the number of key/value pairs in the object.
   */
  key(index: number): string | null {
    return Object.keys(this.storage)[index];
  }
  /**
   * Removes the key/value pair with the given key from the list associated with the object, if a key/value pair with the given key exists.
   */
  removeItem(key: string): void {
    this.storage[key] = undefined;
  }
  /**
   * Sets the value of the pair identified by key to value, creating a new key/value pair if none existed for key previously.
   *
   * Throws a "QuotaExceededError" DOMException exception if the new value couldn't be set. (Setting could fail if, e.g., the user has disabled storage for the site, or if the quota has been exceeded.)
   */
  setItem(key: string, value: string): void {
    this.storage[key] = value;
  }
}
