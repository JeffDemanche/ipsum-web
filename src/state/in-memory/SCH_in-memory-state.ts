import { useContext, useEffect, useState } from "react";
import { InMemoryStateContext } from "./SCH_in-memory-context";
import {
  InMemoryState,
  InMemorySchema,
  CollectionName,
  Document,
  TopLevelField,
  TopLevelFieldName,
  InMemoryField,
  InMemoryCollection,
  CollectionSchema,
} from "./SCH_in-memory-schema";
import { v4 as uuidv4 } from "uuid";

export const initializeDefaultDocument = <C extends CollectionName>(
  type: C
): Document<C> => {
  const schemaDocFields = InMemorySchema[type].fields;
  const document = {} as Document<C>;
  Object.keys(schemaDocFields).forEach((key) => {
    const field = (schemaDocFields as { [key: string]: { default: any } })[key];
    document[key as keyof Document<C>] = field.default();
  });
  return document as Document<C>;
};

export const initializeDefaultInMemoryState = (): InMemoryState => {
  const inMemoryState = {} as InMemoryState;

  Object.keys(InMemorySchema).forEach((key: keyof typeof InMemorySchema) => {
    const thisElement = InMemorySchema[key];
    if (thisElement.__type === "document") {
      (inMemoryState[key] as Document<CollectionName>) = {};
    } else if (thisElement.__type === "field") {
      (inMemoryState[key] as TopLevelField<TopLevelFieldName>) =
        thisElement.default();
    }
  });
  return inMemoryState;
};

export const serializeInMemoryState = (state: InMemoryState): string => {
  const toStringify: any = {};

  Object.keys(InMemorySchema).forEach(
    (collectionOrFieldKey: keyof typeof InMemorySchema) => {
      const collectionOrField = InMemorySchema[collectionOrFieldKey];
      if (collectionOrField.__type === "document") {
        const collection = collectionOrField as InMemoryCollection<
          Record<string, InMemoryField<unknown>>
        >;
        const collectionInState =
          state[collectionOrFieldKey as keyof typeof state];
        const serializedCollection: any = {};

        if (collectionInState) {
          Object.keys(collectionInState).forEach((documentKey: string) => {
            const serializedDocument: any = {};
            const documentInState = collectionInState[
              documentKey as keyof typeof collectionInState
            ] as Document<CollectionName>;

            Object.keys(collection["fields"]).forEach((field) => {
              const fieldValue =
                documentInState[field as keyof typeof documentInState];
              const fieldSchema =
                collection.fields[field as keyof typeof collection.fields];

              if (fieldSchema.serializable) {
                serializedDocument[field] = fieldSchema.customSerializer
                  ? fieldSchema.customSerializer(fieldValue)
                  : fieldValue;
              }
            });

            serializedCollection[documentKey] = serializedDocument;
          });
        }
        toStringify[collectionOrFieldKey] = serializedCollection;
      } else if (collectionOrField.__type === "field") {
        const fieldValue = state[collectionOrFieldKey as keyof typeof state];
        const fieldSchema = collectionOrField as InMemoryField<unknown>;

        if (fieldSchema.serializable) {
          toStringify[collectionOrField.name] = fieldSchema.customSerializer
            ? fieldSchema.customSerializer(fieldValue)
            : fieldValue;
        }
      }
    }
  );

  return JSON.stringify(toStringify);
};

export const deserializeInMemoryState = (
  serializedState: string
): InMemoryState => {
  const rawState = JSON.parse(serializedState);

  const loadedState: any = {};

  Object.keys(InMemorySchema).forEach(
    (collectionOrFieldKey: keyof typeof InMemorySchema) => {
      const collectionOrField = InMemorySchema[collectionOrFieldKey];
      if (!Object.keys(rawState).includes(collectionOrFieldKey)) {
        console.warn(
          `Validation: Loaded text didn't have field or collection ${collectionOrField.name}`
        );
        if (collectionOrField.__type === "document") {
          loadedState[collectionOrFieldKey] = {};
        } else {
          loadedState[collectionOrFieldKey] = collectionOrField.default();
        }
      } else {
        if (collectionOrField.__type === "document") {
          const collectionSchema = collectionOrField as InMemoryCollection<
            Record<string, InMemoryField<unknown>>
          >;
          const loadedCollection: any = {};

          Object.keys(rawState[collectionSchema.name]).forEach(
            (documentKey: CollectionName) => {
              const rawDocument = rawState[collectionSchema.name][documentKey];
              const loadedDocument: any = {};

              Object.keys(collectionOrField["fields"]).forEach((field) => {
                const rawFieldValue = rawDocument[field];
                const rawFieldSchema =
                  collectionSchema.fields[
                    field as keyof typeof collectionSchema.fields
                  ];

                if (rawFieldSchema.serializable) {
                  loadedDocument[field] = rawFieldSchema.customDeserializer
                    ? rawFieldSchema.customDeserializer(rawFieldValue)
                    : rawFieldValue;
                }
              });

              loadedCollection[documentKey] = loadedDocument;
            }
          );
          loadedState[collectionOrFieldKey] = loadedCollection;
        } else if (collectionOrField.__type === "field") {
          const rawValue = rawState[collectionOrFieldKey];
          const schemaField = collectionOrField as InMemoryField<unknown>;

          if (collectionOrField.serializable) {
            loadedState[schemaField.name] = schemaField.customSerializer
              ? schemaField.customDeserializer(rawValue)
              : rawValue;
          }
        }
      }
    }
  );

  return loadedState as InMemoryState;
};

interface UseInMemoryStateDocumentQueryArgs<T extends CollectionName> {
  collection: T;
  keys: CollectionSchema[T]["primaryKey"][];
}

interface UseInMemoryStateDocumentQueryResult<F extends CollectionName> {
  data: {
    [k: string]: Document<F>;
  };
}

export const useStateDocumentQuery = <F extends CollectionName>(
  args: UseInMemoryStateDocumentQueryArgs<F>
): UseInMemoryStateDocumentQueryResult<F> => {
  const { state, addDocumentBroadcaster, removeDocumentBroadcaster } =
    useContext(InMemoryStateContext);

  const [id] = useState(uuidv4());

  const initialStateKeys =
    args.keys.length > 0
      ? Object.keys(state[args.collection]).filter((docKey) =>
          args.keys.includes(docKey)
        )
      : Object.keys(state[args.collection]);
  const initialStateEntries = initialStateKeys.reduce(
    (acc, docKey) => ({ ...acc, [docKey]: state[args.collection][docKey] }),
    {}
  );

  const [data, setData] = useState<{
    [k: string]: Document<F>;
  }>(initialStateEntries);

  useEffect(() => {
    addDocumentBroadcaster({
      id,
      type: "documents",
      collection: args.collection,
      broadcast: (docs) => {
        setData(docs);
      },
      keys: args.keys,
    });
    return () => {
      removeDocumentBroadcaster(id);
    };
  }, [
    addDocumentBroadcaster,
    args.collection,
    args.keys,
    id,
    removeDocumentBroadcaster,
  ]);

  return { data };
};

interface UseInMemoryStateFieldQueryArgs<T extends TopLevelFieldName> {
  field: T;
}

interface UseInMemoryStateFieldQueryResult<F extends TopLevelFieldName> {
  data: TopLevelField<F>;
}

export const useStateFieldQuery = <F extends TopLevelFieldName>(
  args: UseInMemoryStateFieldQueryArgs<F>
): UseInMemoryStateFieldQueryResult<F> => {
  const { state, addFieldBroadcaster, removeFieldBroadcaster } =
    useContext(InMemoryStateContext);

  const [id] = useState(uuidv4);

  const [data, setData] = useState<TopLevelField<F>>(
    state[args.field] as TopLevelField<F>
  );

  useEffect(() => {
    addFieldBroadcaster({
      id,
      type: "field",
      field: args.field,
      broadcast: (field) => {
        setData(field);
      },
    });

    return () => {
      removeFieldBroadcaster(id);
    };
  }, [addFieldBroadcaster, args, id, removeFieldBroadcaster]);

  return { data };
};
