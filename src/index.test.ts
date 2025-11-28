import { describe, test } from "node:test";
import assert from "node:assert";
import createHashTable from "./index";

const RESIZE_OPTIONS = {
  initialCapacity: 4,
  loadFactor: 0.5,
};

type Case = { id: number; collisionMethod: "chaining" | "linear" };

const testCases: Case[] = [
  { id: 1, collisionMethod: "chaining" },
  { id: 2, collisionMethod: "linear" },
];

describe("CRUD", () => {
  testCases.forEach(({ id, collisionMethod }) => {
    test(`1.${id}. ${collisionMethod}. CRUD (String Key)`, () => {
      const options = {
        ...RESIZE_OPTIONS,
        collisionMethod: collisionMethod,
      } as const;
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
  });
});

describe("DELETE", () => {
  testCases.forEach(({ id, collisionMethod }) => {
    test(`2.${id}. ${collisionMethod} Операция DELETE (String Key)`, () => {
      const options = {
        ...RESIZE_OPTIONS,
        collisionMethod: collisionMethod,
      } as const;
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
  });
});

describe("Resizing", () => {
  testCases.forEach(({ id, collisionMethod }) => {
    test(`3.${id}. ${collisionMethod}. Ресайзинг и сохранение целостности данных (Number Key)`, () => {
      const options = {
        ...RESIZE_OPTIONS,
        collisionMethod: collisionMethod,
      } as const;
      const table = createHashTable<number, number>(options);

      table.set(1, 10).set(2, 20);

      table.set(3, 30);

      assert.strictEqual(table.size(), 3, "Размер должен остаться 3.");

      assert.strictEqual(
        table.get(1),
        10,
        "Элемент 1 должен быть доступен после ресайза."
      );
      assert.strictEqual(table.get(3), 30, "Элемент 3 должен быть доступен.");
    });
  });
});

describe("Коллизии", () => {
  testCases.forEach(({ id, collisionMethod }) => {
    test(`4.${id}. ${collisionMethod}. Коллизии и Удаление (String Key)`, () => {
      const options = {
        ...RESIZE_OPTIONS,
        collisionMethod: collisionMethod,
      } as const;
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
  });
});

describe("CLEAR", () => {
  testCases.forEach(({ id, collisionMethod }) => {
    test(`5.${id}. ${collisionMethod}. Операция CLEAR`, () => {
      const options = {
        initialCapacity: 8,
        loadFactor: 0.75,
        collisionMethod: collisionMethod,
      } as const;
      const table = createHashTable<string, number>(options);

      table.set("x", 1).set("y", 2).set("z", 3);
      table.clear();

      assert.strictEqual(
        table.size(),
        0,
        "Размер должен быть 0 после очистки."
      );
      assert.strictEqual(
        table.get("x"),
        undefined,
        "GET должен вернуть undefined."
      );
    });
  });
});
