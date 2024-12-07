import { makeVar } from "@apollo/client";
import { PathReporter } from "io-ts/lib/PathReporter";
import { SerializedSchema, validate } from "util/serializer";
import { v4 as uuidv4 } from "uuid";

import { ProjectCollection } from "./project-collection";
import {
  DeserializationResult,
  InMemoryArc,
  InMemoryArcEntry,
  InMemoryComment,
  InMemoryDay,
  InMemoryEntry,
  InMemoryHighlight,
  InMemoryJournalEntry,
  InMemoryRelation,
  InMemorySRSCard,
  ReactiveInMemoryProjectCollections,
  ReactiveInMemoryProjectSingletons,
  ReactiveInMemoryProjectState,
  SingletonKey,
  StaticInMemoryProjectState,
} from "./types";

export class ProjectState {
  static serializedSingletons: (keyof ReactiveInMemoryProjectSingletons)[] = [
    "projectVersion",
    "journalId",
    "journalMetadata",
    "journalTitle",
  ];

  static serializedCollections: (keyof ReactiveInMemoryProjectCollections)[] = [
    "entries",
    "journalEntries",
    "arcEntries",
    "arcs",
    "highlights",
    "relations",
    "comments",
    "days",
    "srsCards",
  ];

  private readonly reactiveState: ReactiveInMemoryProjectState;

  constructor(state?: StaticInMemoryProjectState) {
    if (state) {
      this.reactiveState = makeStateReactive(state);
    } else {
      this.reactiveState = this.initializeState();
    }
  }

  private initializeState(): ReactiveInMemoryProjectState {
    return {
      singletons: {
        projectVersion: makeVar("0.1"),
        journalId: makeVar(uuidv4()),
        journalMetadata: makeVar({
          __typename: "JournalMetadata",
          lastArcHue: 0,
        }),
        journalTitle: makeVar("New journal"),
      },
      collections: {
        entries: new ProjectCollection<InMemoryEntry>(),
        journalEntries: new ProjectCollection<InMemoryJournalEntry>(),
        arcEntries: new ProjectCollection<InMemoryArcEntry>(),
        arcs: new ProjectCollection<InMemoryArc>(),
        highlights: new ProjectCollection<InMemoryHighlight>(),
        relations: new ProjectCollection<InMemoryRelation>(),
        comments: new ProjectCollection<InMemoryComment>(),
        days: new ProjectCollection<InMemoryDay>(),
        srsCards: new ProjectCollection<InMemorySRSCard>(),
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

  static fromSerialized(serializedState: string): DeserializationResult {
    const raw = JSON.parse(serializedState);
    const parsed = SerializedSchema.decode(raw);

    if (parsed._tag === "Left") {
      return {
        result: "parse_error",
        messages: PathReporter.report(parsed),
      };
    } else {
      const staticState = {
        projectVersion: parsed.right.projectVersion,
        journalId: parsed.right.journalId,
        journalMetadata: parsed.right.journalMetadata,
        journalTitle: parsed.right.journalTitle,
        entries: parsed.right.entries,
        journalEntries: parsed.right.journalEntries,
        arcEntries: parsed.right.arcEntries,
        arcs: parsed.right.arcs,
        highlights: parsed.right.highlights,
        relations: parsed.right.relations,
        comments: parsed.right.comments,
        days: parsed.right.days,
        srsCards: parsed.right.srsCards,
      };

      const validationResult = validate(staticState);
      if (validationResult.result === "fail") {
        return {
          result: "validator_error",
          validator: validationResult,
        };
      }

      return {
        result: "success",
        state: new ProjectState(staticState),
      };
    }
  }
}

const makeStateReactive = (
  state: StaticInMemoryProjectState
): ReactiveInMemoryProjectState => {
  return {
    singletons: {
      projectVersion: makeVar(state.projectVersion),
      journalId: makeVar(state.journalId),
      journalMetadata: makeVar(state.journalMetadata),
      journalTitle: makeVar(state.journalTitle),
    },
    collections: {
      entries: new ProjectCollection(state.entries),
      journalEntries: new ProjectCollection(state.journalEntries),
      arcEntries: new ProjectCollection(state.arcEntries),
      arcs: new ProjectCollection(state.arcs),
      highlights: new ProjectCollection(state.highlights),
      relations: new ProjectCollection(state.relations),
      comments: new ProjectCollection(state.comments),
      days: new ProjectCollection(state.days),
      srsCards: new ProjectCollection(state.srsCards),
    },
  };
};
