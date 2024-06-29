import { makeVar } from "@apollo/client";
import { PathReporter } from "io-ts/lib/PathReporter";
import { v4 as uuidv4 } from "uuid";

import { ProjectCollection } from "./project-collection";
import { SerializedSchema } from "./serializer-schema";
import {
  InMemoryArc,
  InMemoryArcEntry,
  InMemoryComment,
  InMemoryCommentEntry,
  InMemoryDay,
  InMemoryEntry,
  InMemoryHighlight,
  InMemoryJournalEntry,
  InMemoryRelation,
  ReactiveInMemoryProjectCollections,
  ReactiveInMemoryProjectSingletons,
  ReactiveInMemoryProjectState,
  SingletonKey,
  StaticInMemoryProjectState,
} from "./types";

export class ProjectState {
  static serializedSingletons: (keyof ReactiveInMemoryProjectSingletons)[] = [
    "journalId",
    "journalMetadata",
    "journalTitle",
  ];

  static serializedCollections: (keyof ReactiveInMemoryProjectCollections)[] = [
    "entries",
    "journalEntries",
    "arcEntries",
    "commentEntries",
    "arcs",
    "highlights",
    "relations",
    "comments",
    "days",
  ];

  private readonly reactiveState: ReactiveInMemoryProjectState;

  constructor(state?: StaticInMemoryProjectState) {
    if (state) {
      this.reactiveState = makeStateReactive(state);
    }

    this.reactiveState = this.initializeState();
  }

  private initializeState(): ReactiveInMemoryProjectState {
    return {
      singletons: {
        journalId: makeVar(uuidv4()),
        journalMetadata: makeVar({
          __typename: "JournalMetadata",
          lastArcHue: 0,
        }),
        journalTitle: makeVar(""),
      },
      collections: {
        entries: new ProjectCollection<InMemoryEntry>(),
        journalEntries: new ProjectCollection<InMemoryJournalEntry>(),
        arcEntries: new ProjectCollection<InMemoryArcEntry>(),
        commentEntries: new ProjectCollection<InMemoryCommentEntry>(),
        arcs: new ProjectCollection<InMemoryArc>(),
        highlights: new ProjectCollection<InMemoryHighlight>(),
        relations: new ProjectCollection<InMemoryRelation>(),
        comments: new ProjectCollection<InMemoryComment>(),
        days: new ProjectCollection<InMemoryDay>(),
      },
    };
  }

  get<T extends SingletonKey>(singletonKey: T): StaticInMemoryProjectState[T] {
    // @ts-expect-error We can assue value has the correct type.
    return this.reactiveState.singletons[singletonKey]();
  }

  set<T extends SingletonKey>(
    singletonKey: T,
    value: StaticInMemoryProjectState[T]
  ) {
    // @ts-expect-error We can assue value has the correct type.
    this.reactiveState.singletons[singletonKey](value);
  }

  collection<K extends keyof ReactiveInMemoryProjectCollections>(name: K) {
    return this.reactiveState.collections[name];
  }

  toSerialized(): string {
    return JSON.stringify({
      ...ProjectState.serializedSingletons.reduce((prev, curr) => {
        return {
          ...prev,
          [curr]: this.reactiveState.singletons[curr](),
        };
      }, {}),
      ...ProjectState.serializedCollections.reduce((prev, curr) => {
        return {
          ...prev,
          [curr]: this.reactiveState.collections[curr].toObject(),
        };
      }, {}),
    });
  }

  static fromSerialized(serializedState: string): ProjectState {
    const raw = JSON.parse(serializedState);
    const parsed = SerializedSchema.decode(raw);

    if (parsed._tag === "Left") {
      PathReporter.report(parsed).forEach((error) => console.error(error));
      throw new Error("Project validation error, see console for details");
    } else {
      const staticState = {
        journalId: parsed.right.journalId,
        journalMetadata: parsed.right.journalMetadata,
        journalTitle: parsed.right.journalTitle,
        entries: parsed.right.entries,
        journalEntries: parsed.right.journalEntries,
        arcEntries: parsed.right.arcEntries,
        commentEntries: parsed.right.commentEntries,
        arcs: parsed.right.arcs,
        highlights: parsed.right.highlights,
        relations: parsed.right.relations,
        comments: parsed.right.comments,
        days: parsed.right.days,
      };
      return new ProjectState(staticState);
    }
  }
}

const makeStateReactive = (
  state: StaticInMemoryProjectState
): ReactiveInMemoryProjectState => {
  return {
    singletons: {
      journalId: makeVar(state.journalId),
      journalMetadata: makeVar(state.journalMetadata),
      journalTitle: makeVar(state.journalTitle),
    },
    collections: {
      entries: new ProjectCollection(state.entries),
      journalEntries: new ProjectCollection(state.journalEntries),
      arcEntries: new ProjectCollection(state.arcEntries),
      commentEntries: new ProjectCollection(state.commentEntries),
      arcs: new ProjectCollection(state.arcs),
      highlights: new ProjectCollection(state.highlights),
      relations: new ProjectCollection(state.relations),
      comments: new ProjectCollection(state.comments),
      days: new ProjectCollection(state.days),
    },
  };
};

const makeStateStatic = (
  state: ReactiveInMemoryProjectState
): StaticInMemoryProjectState => {
  return {
    journalId: state.singletons.journalId(),
    journalMetadata: state.singletons.journalMetadata(),
    journalTitle: state.singletons.journalTitle(),
    entries: state.collections.entries.toObject(),
    journalEntries: state.collections.journalEntries.toObject(),
    arcEntries: state.collections.arcEntries.toObject(),
    commentEntries: state.collections.commentEntries.toObject(),
    arcs: state.collections.arcs.toObject(),
    highlights: state.collections.highlights.toObject(),
    relations: state.collections.relations.toObject(),
    comments: state.collections.comments.toObject(),
    days: state.collections.days.toObject(),
  };
};
