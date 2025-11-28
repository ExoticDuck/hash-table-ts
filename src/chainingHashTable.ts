import { hash } from "./hash";
import { Entry, HashTable, Options } from "./types";

type Bucket<K, V> = Entry<K, V>[];

export default function createChainingHashTable<K extends string | number, V>(
  options: Options
): HashTable<K, V> {
  let capacity = options.initialCapacity;
  let countOfElements = 0;
  let buckets: Array<Bucket<K, V>> = Array.from({ length: capacity }, () => []);

  const hashTable = {
    set,
    get,
    deleteEntry,
    has,
    size,
    clear,
  };

  function set(key: K, value: V) {
    const index = hash<K>(key, capacity);
    const oldBucket = buckets[index];
    const newBucket = setInBucket(oldBucket, key, value);
    buckets[index] = newBucket;
    const load = countOfElements / buckets.length;
    if (load > options.loadFactor) {
      capacity = buckets.length * 2;
      buckets = rehashAllElements(capacity);
    }
    return hashTable;
  }

  function rehashAllElements(capacity: number): Array<Bucket<K, V>> {
    let newTable: Array<Bucket<K, V>> = Array.from(
      { length: capacity },
      () => []
    );
    countOfElements = 0;
    buckets.forEach((bucket: Bucket<K, V>) => {
      if (bucket.length) {
        bucket.forEach((entry) => {
          let index = hash(entry.key, capacity);
          let newBucket = setInBucket(newTable[index], entry.key, entry.value);
          newTable[index] = newBucket;
        });
      }
    });
    return newTable;
  }

  function setInBucket(
    oldBucket: Bucket<K, V>,
    key: K,
    value: V
  ): Bucket<K, V> {
    let newBucket;
    if (oldBucket.length) {
      const entry = oldBucket.find((entry) => entry.key === key);
      if (entry) {
        newBucket = oldBucket.map((entry) => {
          if (entry.key === key) {
            return { key: key, value: value };
          } else {
            return entry;
          }
        });
      } else {
        newBucket = [...oldBucket, { key: key, value: value }];
        countOfElements += 1;
      }
    } else {
      newBucket = [{ key: key, value: value }];
      countOfElements += 1;
    }
    return newBucket;
  }

  function get(key: K): V | undefined {
    const index = hash(key, capacity);
    const bucket = buckets[index];
    if (bucket) {
      return bucket.find((entry) => entry.key === key)?.value;
    }
  }

  function deleteEntry(key: K) {
    const index = hash(key, capacity);
    const bucket = buckets[index];
    if (bucket.length) {
      const entry = bucket.find((entry) => entry.key === key);
      if (entry) {
        const indexOfEntry = bucket.findIndex((entry) => entry.key === key);
        bucket.splice(indexOfEntry, 1);
        buckets[index] = bucket;
        countOfElements -= 1;
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  function has(key: K): boolean {
    const entry = get(key);
    return entry !== undefined;
  }

  function size(): number {
    return countOfElements;
  }

  function clear(): void {
    buckets = Array.from({ length: options.initialCapacity }, () => []);
    capacity = options.initialCapacity;
    countOfElements = 0;
  }

  return hashTable;
}
