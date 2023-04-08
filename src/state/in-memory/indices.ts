import { deepClone } from "util/deep-clone";
import {
  CollectionIndices,
  Document,
  CollectionName,
  InMemorySchema,
  getPrimaryKey,
  InMemoryState,
  WritableInMemoryState,
} from "./in-memory-schema";

/**
 * Creates all indices for a state from scratch.
 */
export const createAllIndices = (state: InMemoryState): InMemoryState => {
  const stateCopy: WritableInMemoryState = deepClone(state);
  stateCopy.__indices = {} as InMemoryState["__indices"];
  Object.keys(InMemorySchema).forEach((colKey: CollectionName) => {
    if (InMemorySchema[colKey].__type === "document") {
      const schemaIndices = InMemorySchema[colKey].indices;
      stateCopy.__indices[colKey] = {};
      schemaIndices.forEach((indexedFieldKey) => {
        stateCopy.__indices[colKey][indexedFieldKey] = {};
        Object.keys(stateCopy[colKey]).forEach((docId) => {
          if (!stateCopy.__indices[colKey][indexedFieldKey])
            stateCopy.__indices[colKey][indexedFieldKey] = {};

          // The value of field named `indexedFieldKey` for document with key
          // `docId`
          const indexedFieldValue = state[colKey][docId][indexedFieldKey];

          if (!stateCopy.__indices[colKey][indexedFieldKey][indexedFieldValue])
            stateCopy.__indices[colKey][indexedFieldKey][indexedFieldValue] =
              [];

          stateCopy.__indices[colKey][indexedFieldKey][indexedFieldValue].push(
            docId
          );
        });
      });
    }
  });
  return stateCopy;
};

/**
 * Creates all indices on a specific collection given a set of documents which
 * have been *added* to that colleciton.
 */
export const indicesForCreatedDocuments = <C extends CollectionName>(
  collection: C,
  prevIndices: CollectionIndices,
  createdDocuments: Document<C>[]
): CollectionIndices => {
  const indexedKeysForCollection = InMemorySchema[collection].indices;
  const clonedCollectionIndices = deepClone(prevIndices ?? {});

  // Iterate indexed fields for the collection
  indexedKeysForCollection.forEach((indexedFieldKey) => {
    // Iterate documents that have been created
    createdDocuments.forEach((createdDocument) => {
      if (clonedCollectionIndices[indexedFieldKey]) {
        const existingIndexedDocs =
          clonedCollectionIndices[indexedFieldKey][
            createdDocument[indexedFieldKey]
          ] ?? [];
        // "highlight" "entryKey" "1/1/2020"
        clonedCollectionIndices[indexedFieldKey][
          createdDocument[indexedFieldKey]
        ] = [
          ...existingIndexedDocs,
          createdDocument[
            getPrimaryKey(collection) as keyof typeof createdDocument
          ],
        ];
      } else {
        clonedCollectionIndices[indexedFieldKey] = {
          [createdDocument[indexedFieldKey]]: [
            createdDocument[
              getPrimaryKey(collection) as keyof typeof createdDocument
            ],
          ],
        };
      }
    });
  });
  return clonedCollectionIndices;
};

/**
 * Updates incides on a specific collection given a set of documents in that
 * collection which have been modified.
 */
export const indicesForUpdatedDocuments = <C extends CollectionName>(
  collection: C,
  prevIndices: CollectionIndices,
  oldDocuments: Document<C>[],
  updatedDocuments: Document<C>[]
): CollectionIndices => {
  const withRemovedDocuments = indicesForRemovedDocuments(
    collection,
    prevIndices,
    oldDocuments
  );
  const withReAddedDocuments = indicesForCreatedDocuments(
    collection,
    withRemovedDocuments,
    updatedDocuments
  );

  return withReAddedDocuments;
};

/**
 * Removes indices on a collection given a set of documents which have been
 * *removed* from that collection.
 */
export const indicesForRemovedDocuments = <C extends CollectionName>(
  collection: C,
  prevIndices: CollectionIndices,
  removedDocuments: Document<C>[]
): CollectionIndices => {
  const indexedKeysForCollection = InMemorySchema[collection].indices;
  const clonedCollectionIndices: CollectionIndices = deepClone(
    prevIndices ?? {}
  );

  // Iterate indexed fields for the collection
  indexedKeysForCollection.forEach((indexedFieldKey) => {
    if (!indexedFieldKey) return;

    // Iterate documents that have been created
    removedDocuments.forEach((removedDocument) => {
      if (!removedDocument) return;

      const indexedFieldValue = removedDocument[indexedFieldKey];

      clonedCollectionIndices[indexedFieldKey][indexedFieldValue] =
        clonedCollectionIndices[indexedFieldKey][indexedFieldValue].filter(
          (docId) =>
            docId !==
            removedDocument[
              getPrimaryKey(collection) as keyof typeof removedDocument
            ]
        );

      // Don't keep around empty indexes
      if (
        clonedCollectionIndices[indexedFieldKey][indexedFieldValue].length === 0
      ) {
        delete clonedCollectionIndices[indexedFieldKey][indexedFieldValue];
      }
    });
  });

  return clonedCollectionIndices;
};
