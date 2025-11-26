import { hash } from "./hash";
import { Entry, HashTable } from "./types";

type Options = {
  initialCapacity: number;
  loadFactor: number;
  collisionMethod: "chaining" | "linear";
};

type Bucket<K, V> = Entry<K, V> | undefined | null;

export default function createLinearHashTable<K extends string | number, V>(
  options: Options
): HashTable<K, V> {
  let capacity = options.initialCapacity;
  let countOfElements = 0;
  let buckets: Array<Bucket<K, V>> = Array.from(
    { length: capacity },
    () => undefined
  );

  const hashTable = {
    set,
    get,
    deleteEntry,
    has,
    size,
    clear,
  };

  function set(key: K, value: V) {
    const start = hash<K>(key, capacity);
    let index = start;

    do {
      const entry = buckets[index];
      if (entry === undefined || entry === null) {
        buckets[index] = { key: key, value: value };
        countOfElements += 1;
        const load = countOfElements / buckets.length;
        if (load > options.loadFactor) {
          capacity = buckets.length * 2;
          buckets = rehashAllElements(capacity);
        }
        return hashTable;
      }

      if (entry.key === key) {
        buckets[index] = { key: key, value: value };
        return hashTable;
      }
      index = (index + 1) % capacity;
    } while (index !== start);
    return hashTable;
  }

  function rehashAllElements(capacity: number): Array<Bucket<K, V>> {
    let newBuckets: Array<Bucket<K, V>> = Array.from(
      { length: capacity },
      () => undefined
    );
    buckets.forEach((bucket: Bucket<K, V>) => {
      if (bucket && bucket !== null) {
        const newStart = hash(bucket.key, capacity);
        let newIndex = newStart;

        do {
          if (newBuckets[newIndex] === undefined) {
            newBuckets[newIndex] = { key: bucket.key, value: bucket.value };
            return;
          }

          newIndex = (newIndex + 1) % capacity;
        } while (newIndex !== newStart);
      }
    });
    return newBuckets;
  }

  function get(key: K): V | undefined {
    const start = hash(key, capacity);
    let index = start;

    do {
      const entry = buckets[index];

      if (entry === undefined) {
        return undefined;
      }

      if (entry !== null && entry.key === key) {
        return entry.value;
      }

      index = (index + 1) % capacity;
    } while (index !== start);

    return undefined;
  }

  function deleteEntry(key: K) {
    const start = hash(key, capacity);
    let index = start;

    do {
      const entry = buckets[index];

      if (entry === undefined) {
        return false;
      }

      if (entry !== null && entry.key === key) {
        buckets[index] = null;
        countOfElements -= 1;
        return true;
      }

      index = (index + 1) % capacity;
    } while (index !== start);

    return false;
  }

  function has(key: K): boolean {
    const entry = get(key);
    return entry !== undefined;
  }

  function size(): number {
    return countOfElements;
  }

  function clear(): void {
    buckets = Array.from({ length: options.initialCapacity }, () => undefined);
    countOfElements = 0;
  }

  return hashTable;
}
