export function hash<K extends string | number>(
  arg: K,
  capacity: number
): number {
  const initHash = 5381;
  let key: string = arg.toString();

  const hash = key
    .split("")
    .reduce((acc, char) => acc * 33 + char.charCodeAt(0), initHash);

  const positiveHash = hash >>> 0;
  return positiveHash % capacity;
}
