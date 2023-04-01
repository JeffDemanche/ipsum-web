import { useContext, useMemo } from "react";
import { CollectionName, Document } from "./in-memory-schema";
import { InMemoryStateContext } from "./in-memory-context";

interface UseFindDocumentsArgs<
  T extends CollectionName,
  F extends keyof Document<T>
> {
  collection: T;
  fieldName: F;
  fieldValue: Document<T>[F];
  enforceIndex?: boolean;
  skip?: boolean;
}

interface UseFindDocumentsReturn<T extends CollectionName> {
  documents: string[];
}

/**
 * Returns an array of IDs in the given `collection` whose field `fieldName` has
 * value `fieldValue`. `enforceIndex: true` will throw an error for unindexed
 * fields, otherwise it will loop through the whole collection to find
 * documents.
 */
export const useFindDocuments = <
  T extends CollectionName,
  F extends keyof Document<T>
>(
  args: UseFindDocumentsArgs<T, F>
): UseFindDocumentsReturn<T> => {
  const { state } = useContext(InMemoryStateContext);

  const indexDictionaryForField =
    state.__indices?.[args.collection]?.[args.fieldName as string];

  const hasIndex =
    indexDictionaryForField &&
    indexDictionaryForField[args.fieldValue as string];

  const documents = useMemo(() => {
    if (args.skip) return [];

    if (!hasIndex) {
      if (args.enforceIndex) {
        throw new Error("Tried to find documents by unindexed field");
      } else {
        return Object.keys(state[args.collection]).filter(
          (doc: string) =>
            (state[args.collection][doc] as Document<T>)[args.fieldName] ===
            args.fieldValue
        );
      }
    } else {
      return indexDictionaryForField[args.fieldValue as string];
    }
  }, [
    args.collection,
    args.enforceIndex,
    args.fieldName,
    args.fieldValue,
    args.skip,
    hasIndex,
    indexDictionaryForField,
    state,
  ]);

  return { documents };
};
