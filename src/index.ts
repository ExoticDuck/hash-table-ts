import createChainingHashTable from "./chainingHashTable";
import createLinearHashTable from "./linearHashTable";
import { OptionsWithMethod } from "./types";

export default function createHashTable<K extends string | number, V>(
  options: OptionsWithMethod = {
    loadFactor: 0.75,
    initialCapacity: 16,
    collisionMethod: "chaining",
  }
) {
  switch (options.collisionMethod) {
    case "chaining":
      return createChainingHashTable<K, V>({
        loadFactor: options.loadFactor,
        initialCapacity: options.initialCapacity,
      });
    case "linear":
      return createLinearHashTable<K, V>({
        loadFactor: options.loadFactor,
        initialCapacity: options.initialCapacity,
      });
  }
}
