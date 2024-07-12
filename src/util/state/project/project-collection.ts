import { makeVar, ReactiveVar } from "@apollo/client";

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

  getReactiveVar(key: string): ReactiveVar<T> | undefined {
    return this.values()[key];
  }

  set(key: string, value: Partial<T>): void {
    const currentValue = this.get(key);
    this.values()[key]({ ...currentValue, ...value });
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