import qs from "qs";
import { useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
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

const nativeSearchParamsToData = <V extends View>(
  searchParams: URLSearchParams
): IpsumURLSearch<V> => {
  return searchParamsToData(searchParams.toString());
};

export const useIpsumSearchParams = <V extends View>(): IpsumURLSearch<V> => {
  const [searchParams] = useSearchParams();

  console.log(searchParams.toString());
  const selectedFields = useMemo(
    () => nativeSearchParamsToData(searchParams),
    [searchParams]
  );

  return selectedFields;
};

/**
 * Hook that accepts a function that transforms the current search params into
 * new ones, and handles navigating to the new URL.
 */
export const useModifySearchParams = <V extends View>() => {
  const searchParams = useIpsumSearchParams<V>();
  const navigate = useNavigate();
  return (modifyFn: (data: IpsumURLSearch<V>) => IpsumURLSearch<V>) => {
    navigate(`?${dataToSearchParams(modifyFn(searchParams))}`, {
      replace: true,
    });
  };
};

export const getParams = <V extends View>() => {
  return searchParamsToData<V>(window.location.search.slice(1));
};
