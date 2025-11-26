import createChainingHashTable from "./chainingHashTable";
import createLinearHashTable from "./linearHashTable";

type Options = {
  initialCapacity: number;
  loadFactor: number;
  collisionMethod: "chaining" | "linear";
};

export default function createHashTable<K extends string | number, V>(
  options: Options = {
    loadFactor: 0.75,
    initialCapacity: 16,
    collisionMethod: "chaining",
  }
) {
  switch (options.collisionMethod) {
    case "chaining":
      return createChainingHashTable<K, V>(options);
    case "linear":
      return createLinearHashTable<K, V>(options);
  }
}
