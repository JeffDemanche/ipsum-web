export const setEquals = <T>(a: Set<T>, b: Set<T>) =>
  a.size === b.size && [...a].every((value) => b.has(value));

/** Is `a` a subset of `b` */
export const isSubset = <T>(a: Set<T>, b: Set<T>) =>
  a && b && a.size <= b.size && [...a].every((value) => b.has(value));

export const intersection = <T>(a: Set<T>, b: Set<T>) =>
  new Set<T>([...a].filter((value) => b.has(value)));
