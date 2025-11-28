import test from "node:test";
import { hash } from "./hash";
import assert from "node:assert";

test("1.1. Hash. Один и тот же ключ должен давать один и тот же результат", () => {
  const capacity = 100;
  const key1 = "apple";
  const key2 = "apple";

  const hash1 = hash(key1, capacity);
  const hash2 = hash(key2, capacity);

  assert.strictEqual(
    hash1,
    hash2,
    "Хеш для одинаковых ключей должен совпадать."
  );
});

test("1.2. Hash. Результат должен быть в пределах емкости (0 <= hash < capacity)", () => {
  const capacity = 10;
  const key = "banana";
  const result = hash(key, capacity);

  assert.ok(result >= 0, "Результат должен быть неотрицательным.");
  assert.ok(result < capacity, "Результат должен быть меньше емкости.");
});

test("1.3. Hash. Смена capacity должна менять результат хеширования", () => {
  const key = "orange";
  const hashSmall = hash(key, 5);
  const hashLarge = hash(key, 100);

  assert.notStrictEqual(
    hashSmall,
    hashLarge,
    "Хеш должен зависеть от емкости."
  );
});

test("1.4. Hash. Обработка строковых ключей", () => {
  const capacity = 50;
  const key = "hello_world";
  const result = hash(key, capacity);

  assert.ok(typeof result === "number", "Результат должен быть числом.");
  assert.ok(
    result >= 0 && result < capacity,
    "Результат должен быть корректным индексом."
  );
});

test("1.5. Hash. Обработка числовых ключей", () => {
  const capacity = 20;
  const key = 12345;
  const result = hash(key, capacity);

  assert.ok(typeof result === "number", "Результат должен быть числом.");
  assert.ok(
    result >= 0 && result < capacity,
    "Результат должен быть корректным индексом."
  );
});
