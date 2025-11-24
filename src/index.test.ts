import { test } from "node:test";
import assert from "node:assert";
import createHashTable from "./index";

const RESIZE_OPTIONS = {
  initialCapacity: 4,
  loadFactor: 0.5,
};

test("Chaining. 1.1. CRUD (String Key)", () => {
  const options = { ...RESIZE_OPTIONS, collisionMethod: "chaining" } as const;
  const table = createHashTable<string, number>(options);

  table.set("keyA", 10).set("keyB", 20);
  assert.strictEqual(table.size(), 2, "Размер должен быть 2.");
  assert.strictEqual(
    table.get("keyA"),
    10,
    "GET должен работать для строкового ключа."
  );
  assert.strictEqual(
    table.has("keyB"),
    true,
    "HAS должен работать для строкового ключа."
  );

  table.set("keyA", 100);
  assert.strictEqual(
    table.get("keyA"),
    100,
    "Должен обновить существующее значение."
  );
  assert.strictEqual(
    table.size(),
    2,
    "Размер не должен меняться при обновлении."
  );
});

test("Linear. 1.1. CRUD (String Key)", () => {
  const options = { ...RESIZE_OPTIONS, collisionMethod: "linear" } as const;
  const table = createHashTable<string, number>(options);

  table.set("keyA", 10).set("keyB", 20);
  assert.strictEqual(table.size(), 2, "Размер должен быть 2.");
  assert.strictEqual(
    table.get("keyA"),
    10,
    "GET должен работать для строкового ключа."
  );
  assert.strictEqual(
    table.has("keyB"),
    true,
    "HAS должен работать для строкового ключа."
  );

  table.set("keyA", 100);
  assert.strictEqual(
    table.get("keyA"),
    100,
    "Должен обновить существующее значение."
  );
  assert.strictEqual(
    table.size(),
    2,
    "Размер не должен меняться при обновлении."
  );
});

test("Chaining. 1.2. CRUD (Number Key)", () => {
  const options = { ...RESIZE_OPTIONS, collisionMethod: "chaining" } as const;
  const table = createHashTable<number, number>(options);

  table.set(10, 10).set(20, 20);
  assert.strictEqual(table.size(), 2, "Размер должен быть 2.");
  assert.strictEqual(
    table.get(10),
    10,
    "GET должен работать для числового ключа."
  );
  assert.strictEqual(
    table.has(20),
    true,
    "HAS должен работать для числового ключа."
  );

  table.set(10, 100);
  assert.strictEqual(
    table.get(10),
    100,
    "Должен обновить существующее значение."
  );
  assert.strictEqual(
    table.size(),
    2,
    "Размер не должен меняться при обновлении."
  );
});

test("Linear. 1.2. CRUD (Number Key)", () => {
  const options = { ...RESIZE_OPTIONS, collisionMethod: "linear" } as const;
  const table = createHashTable<number, number>(options);

  table.set(10, 10).set(20, 20);
  assert.strictEqual(table.size(), 2, "Размер должен быть 2.");
  assert.strictEqual(
    table.get(10),
    10,
    "GET должен работать для числового ключа."
  );
  assert.strictEqual(
    table.has(20),
    true,
    "HAS должен работать для числового ключа."
  );

  table.set(10, 100);
  assert.strictEqual(
    table.get(10),
    100,
    "Должен обновить существующее значение."
  );
  assert.strictEqual(
    table.size(),
    2,
    "Размер не должен меняться при обновлении."
  );
});

test("Chaining. 2.1. Операция DELETE (String Key)", () => {
  const options = { ...RESIZE_OPTIONS, collisionMethod: "chaining" } as const;
  const table = createHashTable<string, number>(options);

  table.set("a", 1).set("b", 2);
  assert.strictEqual(
    table.deleteEntry("a"),
    true,
    "Удаление существующего ключа должно вернуть true."
  );
  assert.strictEqual(table.size(), 1, "Размер должен уменьшиться.");
  assert.strictEqual(
    table.deleteEntry("c"),
    false,
    "Удаление несуществующего ключа должно вернуть false."
  );
  assert.strictEqual(
    table.has("a"),
    false,
    "Удаленный ключ не должен существовать."
  );
});

test("Linear. 2.1. Операция DELETE (String Key)", () => {
  const options = { ...RESIZE_OPTIONS, collisionMethod: "linear" } as const;
  const table = createHashTable<string, number>(options);

  table.set("a", 1).set("b", 2);
  assert.strictEqual(
    table.deleteEntry("a"),
    true,
    "Удаление существующего ключа должно вернуть true."
  );
  assert.strictEqual(table.size(), 1, "Размер должен уменьшиться.");
  assert.strictEqual(
    table.deleteEntry("c"),
    false,
    "Удаление несуществующего ключа должно вернуть false."
  );
  assert.strictEqual(
    table.has("a"),
    false,
    "Удаленный ключ не должен существовать."
  );
});

test("Chaining. 3.1. Ресайзинг и сохранение целостности данных (Number Key)", () => {
  const options = { ...RESIZE_OPTIONS, collisionMethod: "chaining" } as const;
  const table = createHashTable<number, number>(options);

  table.set(1, 10).set(2, 20);
  assert.strictEqual(
    table.table.capacity,
    4,
    "Емкость должна быть 4 до ресайза."
  );

  table.set(3, 30);

  assert.strictEqual(
    table.table.capacity,
    8,
    "Емкость должна удвоиться (до 8) после ресайза."
  );
  assert.strictEqual(table.size(), 3, "Размер должен остаться 3.");

  assert.strictEqual(
    table.get(1),
    10,
    "Элемент 1 должен быть доступен после ресайза."
  );
  assert.strictEqual(table.get(3), 30, "Элемент 3 должен быть доступен.");
});

test("Linear. 3.1. Ресайзинг и сохранение целостности данных (Number Key)", () => {
  const options = { ...RESIZE_OPTIONS, collisionMethod: "linear" } as const;
  const table = createHashTable<number, number>(options);

  table.set(1, 10).set(2, 20);
  assert.strictEqual(
    table.table.capacity,
    4,
    "Емкость должна быть 4 до ресайза."
  );

  table.set(3, 30);

  assert.strictEqual(
    table.table.capacity,
    8,
    "Емкость должна удвоиться (до 8) после ресайза."
  );
  assert.strictEqual(table.size(), 3, "Размер должен остаться 3.");

  assert.strictEqual(
    table.get(1),
    10,
    "Элемент 1 должен быть доступен после ресайза."
  );
  assert.strictEqual(table.get(3), 30, "Элемент 3 должен быть доступен.");
});

test("Chaining. 4.1. Коллизии и Удаление (String Key)", () => {
  const options = { ...RESIZE_OPTIONS, collisionMethod: "chaining" } as const;
  const table = createHashTable<string, number>(options);

  table.set("keyA", 10).set("keyK", 50);
  table.set("keyC", 30);

  assert.strictEqual(table.get("keyA"), 10, "Должен найти элемент 'keyA'.");
  assert.strictEqual(table.get("keyK"), 50, "Должен найти элемент 'keyK'.");

  table.deleteEntry("keyA");
  assert.strictEqual(table.size(), 2);

  assert.strictEqual(
    table.get("keyK"),
    50,
    "Элемент, коллидирующий с удаленным, должен быть доступен."
  );
});

test("Linear. 4.2. Коллизии и Удаление (String Key)", () => {
  const options = { ...RESIZE_OPTIONS, collisionMethod: "linear" } as const;
  const table = createHashTable<string, number>(options);

  table.set("keyA", 10).set("keyK", 50);
  table.set("keyC", 30);

  assert.strictEqual(
    table.get("keyA"),
    10,
    "Должен найти элемент в 'домашнем' слоте."
  );
  assert.strictEqual(
    table.get("keyK"),
    50,
    "Должен найти элемент в смещенном слоте (пробирование)."
  );

  table.deleteEntry("keyA");
  assert.strictEqual(table.size(), 2);

  assert.strictEqual(
    table.get("keyK"),
    50,
    "Элемент, сдвинутый пробированием, должен быть доступен после удаления предыдущего."
  );
});

test("Chaining. 5.1. Операция CLEAR", () => {
  const options = {
    initialCapacity: 8,
    loadFactor: 0.75,
    collisionMethod: "chaining",
  } as const;
  const table = createHashTable<string, number>(options);
  const initialCapacity = options.initialCapacity;

  table.set("x", 1).set("y", 2).set("z", 3);
  table.clear();

  assert.strictEqual(table.size(), 0, "Размер должен быть 0 после очистки.");
  assert.strictEqual(
    table.get("x"),
    undefined,
    "GET должен вернуть undefined."
  );
  assert.strictEqual(
    table.table.capacity,
    initialCapacity,
    "Емкость должна вернуться к начальной (8)."
  );
});

test("Linear. 5.1. Операция CLEAR", () => {
  const options = {
    initialCapacity: 8,
    loadFactor: 0.75,
    collisionMethod: "linear",
  } as const;
  const table = createHashTable<string, number>(options);
  const initialCapacity = options.initialCapacity;

  table.set("x", 1).set("y", 2).set("z", 3);
  table.clear();

  assert.strictEqual(table.size(), 0, "Размер должен быть 0 после очистки.");
  assert.strictEqual(
    table.get("x"),
    undefined,
    "GET должен вернуть undefined."
  );
  assert.strictEqual(
    table.table.capacity,
    initialCapacity,
    "Емкость должна вернуться к начальной (8)."
  );
});
