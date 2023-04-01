import {
  InMemoryState,
  InMemorySchema,
  CollectionName,
  Document,
  TopLevelField,
  TopLevelFieldName,
  InMemoryField,
  InMemoryCollection,
} from "./in-memory-schema";

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
  const inMemoryState = { __indices: {} } as InMemoryState;

  Object.keys(InMemorySchema).forEach((key: keyof typeof InMemorySchema) => {
    const thisElement = InMemorySchema[key];
    if (thisElement.__type === "document") {
      (inMemoryState[key] as Document<CollectionName>) = {};

      const schemaIndices = InMemorySchema[key as CollectionName].indices ?? [];

      inMemoryState.__indices[key as CollectionName] = {};
      schemaIndices.forEach((schemaIndex) => {
        inMemoryState.__indices[key as CollectionName][schemaIndex] = {};
      });
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
