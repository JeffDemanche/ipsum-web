import qs from "qs";
import { useMemo } from "react";
import { useLocation, useNavigate } from "react-router";
import { View, IpsumURLSearch } from "./types";

/**
 * Turns a location href into an object containing the search params. Accepts a
 * type parameter for the route name (since different routes will have different
 * search param type structures).
 */
export const urlToData = <V extends View>(url: string): IpsumURLSearch<V> => {
  return searchParamsToData(new URL(url).search.slice(1)) as IpsumURLSearch<V>;
};

export const searchParamsToData = <V extends View>(
  search: string
): IpsumURLSearch<V> => {
  return qs.parse(search) as IpsumURLSearch<V>;
};

/**
 * Encodes JS object into search params for navigation.
 */
export const dataToSearchParams = <V extends View>(
  data: IpsumURLSearch<V>
): string => {
  return qs.stringify(data, { encode: false });
};

/**
 * Hook that accepts a function that transforms the current search params into
 * new ones, and handles navigating to the new URL.
 */
export const useModifySearchParams = <V extends View>() => {
  const location = useLocation();

  const searchParams = useMemo(
    () => urlToData<V>(window.location.href),
    [location]
  );

  const navigate = useNavigate();
  return (modifyFn: (data: IpsumURLSearch<V>) => IpsumURLSearch<V>) => {
    navigate(`?${dataToSearchParams(modifyFn(searchParams))}`, {
      replace: true,
    });
  };
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
