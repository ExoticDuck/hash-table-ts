type Options = {
  initialCapacity: number;
  loadFactor: number;
  collisionMethod: "chaining" | "linear";
};

type HashTable<K, V> = {
  table: {
    capacity: number;
    size: number;
    buckets: Array<Bucket<K, V>>;
  };
  set(key: K, value: V): HashTable<K, V>;
  get(key: K): V | undefined;
  deleteEntry(key: K): boolean;
  has(key: K): boolean;
  size(): number;
  clear(): void;
};

type Entry<K, V> = {
  readonly key: K;
  readonly value: V;
};

type Bucket<K, V> = Entry<K, V>[];

export default function createChainingHashTable<K extends string | number, V>(
  options: Options = {
    loadFactor: 0.75,
    initialCapacity: 16,
    collisionMethod: "chaining",
  }
): HashTable<K, V> {
  let capacity = options.initialCapacity;
  let countOfElements = 0;
  let buckets: Array<Bucket<K, V>> = Array.from({ length: capacity }, () => []);

  const hashTable = {
    table: {
      capacity: options.initialCapacity || 16,
      size: 0,
      buckets: buckets,
    },
    set,
    get,
    deleteEntry,
    has,
    size,
    clear,
  };

  function hash(arg: K, capacity: number): number {
    const initHash = 5381;
    let key: string = arg.toString();

    const hash = key
      .split("")
      .reduce((acc, char) => acc * 33 + char.charCodeAt(0), initHash);

    const positiveHash = hash >>> 0;
    return positiveHash % capacity;
  }

  function set(key: K, value: V) {
    const index = hash(key, capacity);
    const oldBucket = buckets[index];
    const newBucket = setInBucket(oldBucket, key, value);
    buckets[index] = newBucket;
    const load = countOfElements / buckets.length;
    if (load > options.loadFactor) {
      capacity = buckets.length * 2;
      hashTable.table.capacity = capacity;
      buckets = rehashAllElements(capacity);
      hashTable.table.buckets = buckets;
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
    return !!entry;
  }

  function size(): number {
    return countOfElements;
  }

  function clear(): void {
    buckets = Array.from({ length: options.initialCapacity }, () => []);
    countOfElements = 0;
    hashTable.table.buckets = buckets;
  }

  return hashTable;
}
