import { EditorState } from "draft-js";
import { stringifyContentState } from "util/content-state";
import { IpsumDateTime, stringifyIpsumDateTime } from "util/dates";
import { v4 as uuidv4 } from "uuid";

export interface InMemoryCollection<
  F extends { [name: string]: InMemoryField<unknown> }
> {
  __type: "document";
  name: string;
  primaryKey: string | number;
  fields: F;
}

export interface InMemoryField<T> {
  __type: "field";
  name: string;
  default: () => T;
  serializable: boolean;
  customSerializer?: (value: T) => string;
  customDeserializer?: (text: string) => T;
}

export const InMemoryCollections = {
  entry: {
    __type: "document" as const,
    name: "entry",
    primaryKey: "entryKey",
    fields: {
      entryKey: {
        __type: "field",
        name: "entryKey",
        default: () => "1/1/2000",
        serializable: true,
      },
      date: {
        __type: "field",
        name: "date",
        default: () =>
          stringifyIpsumDateTime(
            IpsumDateTime.fromString("1/1/2000", "entry-printed-date")
          ),
        serializable: true,
      },
      contentState: {
        __type: "field",
        name: "contentState",
        default: () =>
          stringifyContentState(EditorState.createEmpty().getCurrentContent()),
        serializable: true,
      },
    },
  },
  arc: {
    __type: "document" as const,
    name: "arc",
    primaryKey: "id",
    fields: {
      id: {
        __type: "field",
        name: "id",
        default: () => uuidv4(),
        serializable: true,
      },
      name: {
        __type: "field",
        name: "name",
        default: () => "",
        serializable: true,
      },
      color: {
        __type: "field",
        name: "color",
        default: () => 0,
        serializable: true,
      },
    },
  },
  arc_assignment: {
    __type: "document" as const,
    name: "arc_assignment",
    primaryKey: "id",
    fields: {
      id: {
        __type: "field",
        name: "id",
        default: () => uuidv4(),
        serializable: true,
      },
      arcId: {
        __type: "field",
        name: "arcId",
        default: () => undefined as string,
        serializable: true,
      },
      entryKey: {
        __type: "field",
        name: "entryKey",
        default: () => undefined as string,
        serializable: true,
      },
    },
  },
};

export const InMemorySchema = {
  journalId: {
    __type: "field" as const,
    name: "journalId",
    default: () => uuidv4(),
    serializable: true,
  },
  journalTitle: {
    __type: "field" as const,
    name: "journalTitle",
    default: () => "new journal",
    serializable: true,
  },
  journalMetadata: {
    __type: "field" as const,
    name: "journalMetadata",
    default: () => ({
      lastArcHue: 0,
    }),
    serializable: true,
  },
  ...InMemoryCollections,
};

export const getPrimaryKey = (
  collectionName: CollectionName
): CollectionSchema[keyof CollectionSchema]["primaryKey"] => {
  return InMemorySchema[collectionName].primaryKey;
};

export type TopLevelFieldName = {
  [K in keyof typeof InMemorySchema]-?: typeof InMemorySchema[K] extends InMemoryField<unknown>
    ? K
    : never;
}[keyof typeof InMemorySchema];

export type TopLevelField<F extends TopLevelFieldName> = ReturnType<
  typeof InMemorySchema[F]["default"]
>;

export type CollectionName = {
  [K in keyof typeof InMemorySchema]-?: typeof InMemorySchema[K]["__type"] extends "document"
    ? K
    : never;
}[keyof typeof InMemorySchema];

export type CollectionSchema = {
  [K in CollectionName]: typeof InMemorySchema[K]["__type"] extends "document"
    ? typeof InMemorySchema[K]
    : never;
};

// Interesting Typescript bug here:
// https://stackoverflow.com/questions/74944708/create-a-generic-type-that-given-a-fields-key-types-a-subfield-of-that-entry
export type Document<C extends CollectionName> = {
  [fieldName in keyof CollectionSchema[C]["fields"]]: CollectionSchema[C]["fields"][fieldName] extends {
    default: () => infer D;
  }
    ? D
    : never;
};

export type Collection<C extends CollectionName> = {
  [key in CollectionSchema[C]["primaryKey"]]: Document<C>;
};

export type WritableInMemoryState = {
  [key in keyof typeof InMemorySchema]-?: key extends TopLevelFieldName
    ? TopLevelField<key>
    : key extends CollectionName
    ? Collection<key>
    : never;
};

export type InMemoryState = Readonly<{
  [key in keyof typeof InMemorySchema]-?: key extends TopLevelFieldName
    ? Readonly<TopLevelField<key>>
    : key extends CollectionName
    ? Readonly<Collection<key>>
    : never;
}>;
