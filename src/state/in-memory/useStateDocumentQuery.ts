import { useContext, useEffect, useState } from "react";
import { InMemoryStateContext } from "./in-memory-context";
import { CollectionName, CollectionSchema } from "./in-memory-schema";
import { v4 as uuidv4 } from "uuid";
import { Document } from "./in-memory-schema";

interface UseStateDocumentQueryArgs<T extends CollectionName> {
  collection: T;
  keys?: CollectionSchema[T]["primaryKey"][];
  name?: string;
}

interface UseStateDocumentQueryResult<F extends CollectionName> {
  data: {
    [k: string]: Document<F>;
  };
}

export const useStateDocumentQuery = <F extends CollectionName>(
  args: UseStateDocumentQueryArgs<F>
): UseStateDocumentQueryResult<F> => {
  const { state, addDocumentBroadcaster, removeDocumentBroadcaster } =
    useContext(InMemoryStateContext);

  const [id] = useState(uuidv4());

  const collectionData =
    state[args.collection] ?? ({} as typeof state[CollectionName]);

  const initialStateKeys = args.keys
    ? Object.keys(collectionData).filter((docKey) => args.keys.includes(docKey))
    : Object.keys(collectionData);

  const initialStateEntries = initialStateKeys.reduce(
    (acc, docKey) => ({ ...acc, [docKey]: collectionData[docKey] }),
    {}
  );

  const [data, setData] = useState<{
    [k: string]: Document<F>;
  }>(initialStateEntries);

  // As an array, args.keys will cause the useEffect to run every render. If we
  // turn it into a string, it'll only update if the value of the array changes.
  const keysString = `${args.keys}`;
  useEffect(() => {
    addDocumentBroadcaster({
      id,
      type: "documents",
      collection: args.collection,
      broadcast: (docs) => {
        setData(docs);
      },
      keys: args.keys,
      name: args.name,
    });

    return () => {
      removeDocumentBroadcaster(id);
    };
    // Adding addDocumentBroadcaster and removeDocumentBroadcaster would make
    // this run every render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, args.collection, keysString]);

  return { data };
};
