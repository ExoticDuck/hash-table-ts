import createChainingHashTable from "./chainingHashTable";
import createLinearHashTable from "./linearHashTable";

type Options = {
  initialCapacity: number;
  loadFactor: number;
  collisionMethod: "chaining" | "linear";
};

export default function createHashTable<K extends string | number, V>(
  options: Options
) {
  if (options.collisionMethod === "chaining") {
    return createChainingHashTable<K, V>(options);
  } else {
    return createLinearHashTable<K, V>(options);
  }
}
