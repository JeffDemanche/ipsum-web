import qs from "qs";
import { View, IpsumURLSearch } from "./types";

/**
 * Turns a location href into an object containing the search params. Accepts a
 * type parameter for the route name (since different routes will have different
 * search param type structures).
 */
export const urlToData = <V extends View>(url: string): IpsumURLSearch<V> => {
  return qs.parse(new URL(url).search.slice(1)) as IpsumURLSearch<V>;
};

/**
 * Encodes JS object into search params for navigation.
 */
export const dataToSearchParams = <V extends View>(
  data: IpsumURLSearch<V>
): string => {
  return qs.stringify(data, { encode: false });
};

export class IpsumURL {
  private _url: URL;

  constructor(url: URL) {
    this._url = url;
  }

  getView(): View {
    return this._url.pathname.split("/").slice(1, undefined).join("/") as View;
  }

  getViewData<V extends View>(): IpsumURLSearch<V> {
    return qs.parse(this._url.search.slice(1)) as IpsumURLSearch<V>;
  }
}
