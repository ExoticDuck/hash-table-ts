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

type Bucket<K, V> = Entry<K, V> | undefined | null;

export default function createLinearHashTable<K extends string | number, V>(
  options: Options = {
    loadFactor: 0.75,
    initialCapacity: 16,
    collisionMethod: "linear",
  }
): HashTable<K, V> {
  let capacity = options.initialCapacity;
  let countOfElements = 0;
  let buckets: Array<Bucket<K, V>> = Array.from(
    { length: capacity },
    () => undefined
  );

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
    const start = hash(key, capacity);
    let index = start;

    do {
      const entry = buckets[index];
      if (entry === undefined || entry === null) {
        buckets[index] = { key: key, value: value };
        countOfElements += 1;
        const load = countOfElements / buckets.length;
        if (load > options.loadFactor) {
          capacity = buckets.length * 2;
          hashTable.table.capacity = capacity;
          buckets = rehashAllElements(capacity);
          hashTable.table.buckets = buckets;
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
    return !!entry;
  }

  function size(): number {
    return countOfElements;
  }

  function clear(): void {
    buckets = Array.from({ length: options.initialCapacity }, () => undefined);
    countOfElements = 0;
    hashTable.table.buckets = buckets;
  }

  return hashTable;
}
