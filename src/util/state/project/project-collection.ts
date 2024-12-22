import type { ReactiveVar } from "@apollo/client";
import { makeVar } from "@apollo/client";

export class ProjectCollection<T> {
  private readonly values: ReactiveVar<Record<string, ReactiveVar<T>>>;

  constructor(staticCollection?: Record<string, T>) {
    if (staticCollection) {
      const newValues: Record<string, ReactiveVar<T>> = {};
      for (const key in staticCollection) {
        newValues[key] = makeVar(staticCollection[key]);
      }
      this.values = makeVar(newValues);
      return;
    }

    this.values = makeVar({});
  }

  has(key: string): boolean {
    return key in this.values();
  }

  get(key: string): T | undefined {
    return this.values()[key]?.();
  }

  getAll(): Record<string, T> {
    const values = this.values();
    const obj: Record<string, T> = {};
    for (const key in values) {
      obj[key] = values[key]();
    }
    return obj;
  }

  getAllByField<K extends keyof T>(key: K, value: T[K]): Record<string, T> {
    // This is where we could add indexing to improve performance
    return Object.entries(this.getAll())
      .filter(([, v]) => v[key] === value)
      .reduce((acc, [k, v]) => ({ ...acc, [k]: v }), {});
  }

  getReactiveVar(key: string): ReactiveVar<T> | undefined {
    return this.values()[key];
  }

  set(key: string, value: Partial<T>): void {
    const currentValue = this.get(key);
    this.values()[key]({ ...currentValue, ...value });
  }

  mutate(key: string, setter: (v: T) => Partial<T>): void {
    return this.set(key, setter(this.get(key)));
  }

  delete(key: string): boolean {
    const newValues = { ...this.values() };
    const deleted = delete newValues[key];
    this.values(newValues);
    return deleted;
  }

  create(key: string, value: T): T {
    const existingValues = this.values();
    if (key in existingValues) {
      return;
    }
    this.values({ ...existingValues, [key]: makeVar(value) });
    return value;
  }

  toObject(): Record<string, T> {
    const values = this.values();
    const obj: Record<string, T> = {};
    for (const key in values) {
      obj[key] = values[key]();
    }
    return obj;
  }
}
