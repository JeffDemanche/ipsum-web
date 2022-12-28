import { render } from "@testing-library/react";
import React, { FunctionComponent, useContext, useEffect } from "react";
import {
  InMemoryStateContext,
  InMemoryStateProviderWithAutosave,
} from "../SCH_in-memory-context";
import {
  initializeDefaultDocument,
  initializeDefaultInMemoryState,
  useStateDocumentQuery,
  useStateFieldQuery,
} from "../SCH_in-memory-state";
import { IpsumIndexedDBClient } from "util/indexed-db";
import {
  Document,
  InMemoryState,
  TopLevelField,
} from "../SCH_in-memory-schema";

jest.mock("util/indexed-db");

describe("InMemoryContext", () => {
  beforeEach(() => {});

  describe("optimisticDispatch", () => {
    it("applies action and returns an optimistic copy of the resulting state", () => {
      const defaultState = initializeDefaultInMemoryState();

      const StatefulComponent = ({
        onOptimisticDispatch,
        children,
      }: {
        onOptimisticDispatch: (state: InMemoryState) => void;
        children: React.ReactNode;
      }) => {
        const { state, optimisticDispatch, hasLoadedAutosave } =
          useContext(InMemoryStateContext);

        useEffect(() => {
          if (hasLoadedAutosave) {
            const newState = optimisticDispatch(state, {
              type: "CREATE_DOCUMENT",
              payload: { type: "arc", document: {} },
            });
            onOptimisticDispatch(newState);
          }
        }, [optimisticDispatch, hasLoadedAutosave, onOptimisticDispatch]);

        return <div>{children}</div>;
      };

      const UserComponent: FunctionComponent<{
        onDataChange: (data: { [k: string]: object }) => void;
      }> = ({ onDataChange }) => {
        const { data } = useStateDocumentQuery({
          collection: "arc",
          keys: [],
        });

        useEffect(() => {
          onDataChange(data);
        }, [data, onDataChange]);

        return <></>;
      };

      const onOptimisticDispatch = jest.fn();
      const onDataChange = jest.fn();

      render(
        <InMemoryStateProviderWithAutosave
          idbWrapper={new IpsumIndexedDBClient(null)}
          stateFromAutosave={defaultState}
        >
          <StatefulComponent onOptimisticDispatch={onOptimisticDispatch}>
            <UserComponent onDataChange={onDataChange}></UserComponent>
          </StatefulComponent>
        </InMemoryStateProviderWithAutosave>
      );

      expect(
        Object.keys(onOptimisticDispatch.mock.calls[0][0].arc)
      ).toHaveLength(1);
    });
  });

  describe("queries", () => {
    describe("collection queries", () => {
      it("query for an entry gets updated when the entry is created", () => {
        const StatefulComponent = ({
          children,
        }: {
          children: React.ReactNode;
        }) => {
          const { dispatch, hasLoadedAutosave } =
            useContext(InMemoryStateContext);

          useEffect(() => {
            if (hasLoadedAutosave) {
              dispatch({
                type: "CREATE_DOCUMENT",
                payload: { type: "entry", document: { entryKey: "10/10/20" } },
              });
            }
          }, [dispatch, hasLoadedAutosave]);

          return <div>{children}</div>;
        };

        const UserComponent: FunctionComponent<{
          onDataChange: (data: { [k: string]: object }) => void;
        }> = ({ onDataChange }) => {
          const { data } = useStateDocumentQuery({
            collection: "entry",
            keys: ["10/10/20"],
          });

          useEffect(() => {
            onDataChange(data);
          }, [data, onDataChange]);

          return <></>;
        };

        const onDataChange = jest.fn();

        const defaultState = initializeDefaultInMemoryState();

        render(
          <InMemoryStateProviderWithAutosave
            idbWrapper={new IpsumIndexedDBClient(null)}
            stateFromAutosave={defaultState}
          >
            <StatefulComponent>
              <UserComponent onDataChange={onDataChange}></UserComponent>
            </StatefulComponent>
          </InMemoryStateProviderWithAutosave>
        );

        expect(onDataChange.mock.calls[0][0]).toEqual({});
        expect(Object.keys(onDataChange.mock.calls[1][0]).length).toBe(1);
        expect(onDataChange.mock.calls[1][0]["10/10/20"].entryKey).toEqual(
          "10/10/20"
        );
      });

      it("query with empty keys param returns all documents in collection", () => {
        const arc: { [id: string]: Document<"arc"> } = {
          arc_1: { ...initializeDefaultDocument("arc"), id: "arc_1" },
          arc_2: { ...initializeDefaultDocument("arc"), id: "arc_2" },
          arc_3: { ...initializeDefaultDocument("arc"), id: "arc_3" },
        };

        const UserComponent: FunctionComponent<{
          onDataChange: (data: { [k: string]: object }) => void;
        }> = ({ onDataChange }) => {
          const { data } = useStateDocumentQuery({
            collection: "arc",
            keys: [],
          });

          useEffect(() => {
            onDataChange(data);
          }, [data, onDataChange]);

          return <></>;
        };

        const onDataChange = jest.fn();

        const defaultState = initializeDefaultInMemoryState();

        render(
          <InMemoryStateProviderWithAutosave
            idbWrapper={new IpsumIndexedDBClient(null)}
            stateFromAutosave={{ ...defaultState, arc }}
          >
            <UserComponent onDataChange={onDataChange}></UserComponent>
          </InMemoryStateProviderWithAutosave>
        );

        expect(onDataChange.mock.calls[0][0]).toEqual({ ...arc });
      });

      it("query for specific arcs updates when one of the arcs is updated", () => {
        const arc: { [id: string]: Document<"arc"> } = {
          arc_1: { ...initializeDefaultDocument("arc"), id: "arc_1" },
          arc_2: { ...initializeDefaultDocument("arc"), id: "arc_2" },
          arc_3: { ...initializeDefaultDocument("arc"), id: "arc_3" },
        };

        const StatefulComponent = ({
          children,
        }: {
          children: React.ReactNode;
        }) => {
          const { dispatch, hasLoadedAutosave } =
            useContext(InMemoryStateContext);

          useEffect(() => {
            if (hasLoadedAutosave) {
              dispatch({
                type: "UPDATE_DOCUMENT",
                payload: { type: "arc", key: "arc_3", update: { color: 1 } },
              });
            }
          }, [dispatch, hasLoadedAutosave]);

          return <div>{children}</div>;
        };

        const UserComponent: FunctionComponent<{
          onDataChange: (data: { [k: string]: object }) => void;
        }> = ({ onDataChange }) => {
          const { data } = useStateDocumentQuery({
            collection: "arc",
            keys: ["arc_1", "arc_3"],
          });

          useEffect(() => {
            onDataChange(data);
          }, [data, onDataChange]);

          return <></>;
        };

        const onDataChange = jest.fn();

        const defaultState = initializeDefaultInMemoryState();

        render(
          <InMemoryStateProviderWithAutosave
            idbWrapper={new IpsumIndexedDBClient(null)}
            stateFromAutosave={{ ...defaultState, arc }}
          >
            <StatefulComponent>
              <UserComponent onDataChange={onDataChange}></UserComponent>
            </StatefulComponent>
          </InMemoryStateProviderWithAutosave>
        );

        expect(onDataChange.mock.calls[0][0]).toEqual({
          arc_1: arc.arc_1,
          arc_3: arc.arc_3,
        });
        expect(onDataChange.mock.calls[1][0]).toEqual({
          arc_1: arc.arc_1,
          arc_3: { ...arc.arc_3, color: 1 },
        });
      });

      it("query for specific arcs doesn't update when a non-queried arc is updated", () => {
        const arc: { [id: string]: Document<"arc"> } = {
          arc_1: { ...initializeDefaultDocument("arc"), id: "arc_1" },
          arc_2: { ...initializeDefaultDocument("arc"), id: "arc_2" },
          arc_3: { ...initializeDefaultDocument("arc"), id: "arc_3" },
        };

        const StatefulComponent = ({
          children,
        }: {
          children: React.ReactNode;
        }) => {
          const { dispatch, hasLoadedAutosave } =
            useContext(InMemoryStateContext);

          useEffect(() => {
            if (hasLoadedAutosave) {
              dispatch({
                type: "UPDATE_DOCUMENT",
                payload: { type: "arc", key: "arc_2", update: { color: 1 } },
              });
            }
          }, [dispatch, hasLoadedAutosave]);

          return <div>{children}</div>;
        };

        const UserComponent: FunctionComponent<{
          onDataChange: (data: { [k: string]: object }) => void;
        }> = ({ onDataChange }) => {
          const { data } = useStateDocumentQuery({
            collection: "arc",
            keys: ["arc_1", "arc_3"],
          });

          useEffect(() => {
            onDataChange(data);
          }, [data, onDataChange]);

          return <></>;
        };

        const onDataChange = jest.fn();

        const defaultState = initializeDefaultInMemoryState();

        render(
          <InMemoryStateProviderWithAutosave
            idbWrapper={new IpsumIndexedDBClient(null)}
            stateFromAutosave={{ ...defaultState, arc }}
          >
            <StatefulComponent>
              <UserComponent onDataChange={onDataChange}></UserComponent>
            </StatefulComponent>
          </InMemoryStateProviderWithAutosave>
        );

        expect(onDataChange.mock.calls[0][0]).toEqual({
          arc_1: arc.arc_1,
          arc_3: arc.arc_3,
        });
        expect(onDataChange.mock.calls.length).toBe(1);
      });
    });

    describe("field queries", () => {
      it("query for journalTitle updates when journalTitle is changed", () => {
        const StatefulComponent = ({
          children,
        }: {
          children: React.ReactNode;
        }) => {
          const { dispatch, hasLoadedAutosave } =
            useContext(InMemoryStateContext);

          useEffect(() => {
            if (hasLoadedAutosave) {
              dispatch({
                type: "UPDATE_FIELD",
                payload: { field: "journalTitle", update: "new title" },
              });
            }
          }, [dispatch, hasLoadedAutosave]);

          return <div>{children}</div>;
        };

        const UserComponent: FunctionComponent<{
          onDataChange: (data: string) => void;
        }> = ({ onDataChange }) => {
          const { data } = useStateFieldQuery({
            field: "journalTitle",
          });

          useEffect(() => {
            onDataChange(data);
          }, [data, onDataChange]);

          return <></>;
        };

        const onDataChange = jest.fn();

        const defaultState = initializeDefaultInMemoryState();

        render(
          <InMemoryStateProviderWithAutosave
            idbWrapper={new IpsumIndexedDBClient(null)}
            stateFromAutosave={{ ...defaultState, journalTitle: "old title" }}
          >
            <StatefulComponent>
              <UserComponent onDataChange={onDataChange}></UserComponent>
            </StatefulComponent>
          </InMemoryStateProviderWithAutosave>
        );

        expect(onDataChange.mock.calls[0][0]).toEqual("old title");
        expect(onDataChange.mock.calls[1][0]).toEqual("new title");
      });

      it("query for journalMetadata does not update when journalTitle is changed", () => {
        const StatefulComponent = ({
          children,
        }: {
          children: React.ReactNode;
        }) => {
          const { dispatch, hasLoadedAutosave } =
            useContext(InMemoryStateContext);

          useEffect(() => {
            if (hasLoadedAutosave) {
              dispatch({
                type: "UPDATE_FIELD",
                payload: { field: "journalTitle", update: "new title" },
              });
            }
          }, [dispatch, hasLoadedAutosave]);

          return <div>{children}</div>;
        };

        const UserComponent: FunctionComponent<{
          onDataChange: (data: TopLevelField<"journalMetadata">) => void;
        }> = ({ onDataChange }) => {
          const { data } = useStateFieldQuery({
            field: "journalMetadata",
          });

          useEffect(() => {
            onDataChange(data);
          }, [data, onDataChange]);

          return <></>;
        };

        const onDataChange = jest.fn();

        const defaultState = initializeDefaultInMemoryState();

        render(
          <InMemoryStateProviderWithAutosave
            idbWrapper={new IpsumIndexedDBClient(null)}
            stateFromAutosave={{
              ...defaultState,
              journalTitle: "old title",
              journalMetadata: { lastArcHue: 123 },
            }}
          >
            <StatefulComponent>
              <UserComponent onDataChange={onDataChange}></UserComponent>
            </StatefulComponent>
          </InMemoryStateProviderWithAutosave>
        );

        expect(onDataChange.mock.calls).toHaveLength(1);
        expect(onDataChange.mock.calls[0][0]).toEqual({ lastArcHue: 123 });
      });
    });
  });
});
