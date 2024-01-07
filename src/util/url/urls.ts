import qs from "qs";
import { useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { View, IpsumURLSearch } from "./types";

export const EMPTY_ARRAY = "[]";
export const EMPTY_OBJECT = "{}";

/**
 * QS gets rid of empty arrays and objects, but we want to preserve them so we
 * pass data through this before encoding for search params.
 */
const serializeEmpty = (data: unknown): unknown => {
  if (!data) {
    return data;
  } else if (Array.isArray(data)) {
    if (data.length === 0) {
      return EMPTY_ARRAY;
    } else {
      return data.map(serializeEmpty);
    }
  } else if (typeof data === "object") {
    if (Object.keys(data).length === 0) {
      return EMPTY_OBJECT;
    } else {
      return Object.keys(data).reduce((acc, key) => {
        // @ts-expect-error - TS doesn't know that this is a valid key.
        acc[key] = serializeEmpty(data[key]);
        return acc;
      }, {});
    }
  }

  return data;
};

const deserializeEmpty = (data: unknown): unknown => {
  if (!data) {
    return data;
  } else if (Array.isArray(data)) {
    return data.map(deserializeEmpty);
  } else if (typeof data === "object") {
    return Object.keys(data).reduce((acc, key) => {
      // @ts-expect-error - TS doesn't know that this is a valid key.
      acc[key] = deserializeEmpty(data[key]);
      return acc;
    }, {});
  }

  if (data === EMPTY_ARRAY) {
    return [];
  }
  if (data === EMPTY_OBJECT) {
    return {};
  }

  return data;
};

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
  return deserializeEmpty(qs.parse(search) as IpsumURLSearch<V>);
};

/**
 * Encodes JS object into search params for navigation.
 */
export const dataToSearchParams = <V extends View>(
  data: IpsumURLSearch<V>
): string => {
  return qs.stringify(serializeEmpty(data), {
    encode: false,
  });
};

const nativeSearchParamsToData = <V extends View>(
  searchParams: URLSearchParams
): IpsumURLSearch<V> => {
  return searchParamsToData(searchParams.toString());
};

export const useIpsumSearchParams = <V extends View>(): IpsumURLSearch<V> => {
  const [searchParams] = useSearchParams();

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
