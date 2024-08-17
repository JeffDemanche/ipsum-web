import { IpsumURLSearch, View } from "util/state";

export type URLFunction<T, V extends View> = (
  args: T,
  state: IpsumURLSearch<V>
) => IpsumURLSearch<V>;
