export type HashTable<K, V> = {
  set(key: K, value: V): HashTable<K, V>;
  get(key: K): V | undefined;
  deleteEntry(key: K): boolean;
  has(key: K): boolean;
  size(): number;
  clear(): void;
};

export type Entry<K, V> = {
  readonly key: K;
  readonly value: V;
};

export type OptionsWithMethod = Options & {
  collisionMethod: "chaining" | "linear";
};

export type Options = {
  initialCapacity: number;
  loadFactor: number;
};
