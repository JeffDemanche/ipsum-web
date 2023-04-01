import { render } from "@testing-library/react";
import React, {
  FunctionComponent,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  InMemoryStateContext,
  InMemoryStateProviderWithAutosave,
} from "../in-memory-context";
import {
  initializeDefaultDocument,
  initializeDefaultInMemoryState,
} from "../in-memory-state";
import { IpsumIndexedDBClient } from "util/indexed-db";
import { Document, InMemoryState, TopLevelField } from "../in-memory-schema";
import { useStateDocumentQuery } from "../useStateDocumentQuery";
import { useStateFieldQuery } from "../useStateFieldQuery";

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
        }, [
          optimisticDispatch,
          hasLoadedAutosave,
          onOptimisticDispatch,
          state,
        ]);

        return <div>{children}</div>;
      };

      const UserComponent: FunctionComponent<{
        onDataChange: (data: { [k: string]: object }) => void;
      }> = ({ onDataChange }) => {
        const { data } = useStateDocumentQuery({
          collection: "arc",
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
      it("query returns nothing when state isn't defined", () => {
        const UserComponent: FunctionComponent<{
          onDataChange: (data: { [k: string]: object }) => void;
        }> = ({ onDataChange }) => {
          const { data } = useStateDocumentQuery({
            collection: "entry",
          });

          useEffect(() => {
            onDataChange(data);
          }, [data, onDataChange]);

          return <></>;
        };

        const onDataChange = jest.fn();

        render(
          <InMemoryStateProviderWithAutosave
            idbWrapper={new IpsumIndexedDBClient(null)}
            stateFromAutosave={undefined}
          >
            <UserComponent onDataChange={onDataChange}></UserComponent>
          </InMemoryStateProviderWithAutosave>
        );
        expect(onDataChange.mock.calls).toHaveLength(0);
      });

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

      it("query data updates when keys change", () => {
        const arc: { [id: string]: Document<"arc"> } = {
          arc_1: { ...initializeDefaultDocument("arc"), id: "arc_1" },
          arc_2: { ...initializeDefaultDocument("arc"), id: "arc_2" },
          arc_3: { ...initializeDefaultDocument("arc"), id: "arc_3" },
        };

        const UserComponent: FunctionComponent<{
          onDataChange: (data: { [k: string]: object }) => void;
          keys: string[];
        }> = ({ onDataChange, keys }) => {
          const { data } = useStateDocumentQuery({
            collection: "arc",
            keys,
          });

          useEffect(() => {
            onDataChange(data);
          }, [data, onDataChange]);

          return <></>;
        };

        const onDataChange = jest.fn();

        const defaultState = initializeDefaultInMemoryState();

        const Component: React.FunctionComponent<{ keys: string[] }> = ({
          keys,
        }) => {
          return (
            <InMemoryStateProviderWithAutosave
              idbWrapper={new IpsumIndexedDBClient(null)}
              stateFromAutosave={{ ...defaultState, arc }}
            >
              <UserComponent
                onDataChange={onDataChange}
                keys={keys}
              ></UserComponent>
            </InMemoryStateProviderWithAutosave>
          );
        };

        const { rerender } = render(<Component keys={["arc_1"]}></Component>);

        expect(onDataChange.mock.calls.length).toEqual(1);
        expect(onDataChange.mock.calls[0][0]).toEqual({
          arc_1: arc.arc_1,
        });

        rerender(<Component keys={["arc_1", "arc_2"]}></Component>);

        expect(onDataChange.mock.calls.length).toEqual(2);
        expect(onDataChange.mock.calls[1][0]).toEqual({
          arc_1: arc.arc_1,
          arc_2: arc.arc_2,
        });

        rerender(<Component keys={["arc_3"]}></Component>);

        expect(onDataChange.mock.calls.length).toEqual(3);
        expect(onDataChange.mock.calls[2][0]).toEqual({
          arc_3: arc.arc_3,
        });
      });

      it("query for specific arc updates when arc is removed", () => {
        const arc: { [id: string]: Document<"arc"> } = {
          arc_1: { ...initializeDefaultDocument("arc"), id: "arc_1" },
          arc_2: { ...initializeDefaultDocument("arc"), id: "arc_2" },
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
                type: "REMOVE_DOCUMENT",
                payload: { type: "arc", key: "arc_2" },
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
            keys: ["arc_2"],
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

        expect(onDataChange.mock.calls.length).toBe(2);
        expect(onDataChange.mock.calls[0][0]).toEqual({
          arc_2: arc.arc_2,
        });
        expect(onDataChange.mock.calls[1][0]).toEqual({});
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

        expect(onDataChange.mock.calls.length).toEqual(2);
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

  describe("resetToInitial", () => {
    it("overwrites state to default on query for all entries", () => {
      const StatefulComponent = ({
        children,
      }: {
        children: React.ReactNode;
      }) => {
        const { resetToInitial, hasLoadedAutosave } =
          useContext(InMemoryStateContext);

        const [hasReset, setHasReset] = useState(false);
        useEffect(() => {
          if (!hasReset && hasLoadedAutosave) {
            resetToInitial();
            setHasReset(true);
          }
        }, [hasReset, hasLoadedAutosave]);

        return <div>{children}</div>;
      };

      const UserComponent: FunctionComponent<{
        onData: (data: { [entryKey: string]: Document<"entry"> }) => void;
      }> = ({ onData }) => {
        const { data } = useStateDocumentQuery({
          collection: "entry",
        });

        useEffect(() => {
          onData(data);
        }, [data]);

        return <></>;
      };

      const defaultState = {
        ...initializeDefaultInMemoryState(),
        entry: {
          entry_1: {
            ...initializeDefaultDocument("entry"),
            entryKey: "entry_1",
          },
        },
      };

      const onData = jest.fn();

      const Component: React.FunctionComponent = () => {
        return (
          <InMemoryStateProviderWithAutosave
            idbWrapper={new IpsumIndexedDBClient(null)}
            stateFromAutosave={defaultState}
          >
            <StatefulComponent>
              <UserComponent onData={onData}></UserComponent>
            </StatefulComponent>
          </InMemoryStateProviderWithAutosave>
        );
      };

      render(<Component></Component>);

      expect(onData).toHaveBeenCalledTimes(2);
      expect(onData.mock.calls[0][0].entry_1).toBeDefined();
      expect(onData.mock.calls[1][0]).toEqual({});
    });

    it("overwrites state to default on query for a single entryKey", () => {
      const StatefulComponent = ({
        children,
      }: {
        children: React.ReactNode;
      }) => {
        const { resetToInitial, hasLoadedAutosave } =
          useContext(InMemoryStateContext);

        const [hasReset, setHasReset] = useState(false);
        useEffect(() => {
          if (!hasReset && hasLoadedAutosave) {
            resetToInitial();
            setHasReset(true);
          }
        }, [hasReset, hasLoadedAutosave]);

        return <div>{children}</div>;
      };

      const UserComponent: FunctionComponent<{
        onData: (data: { [entryKey: string]: Document<"entry"> }) => void;
      }> = ({ onData }) => {
        const { data } = useStateDocumentQuery({
          collection: "entry",
          keys: ["entry_1"],
        });

        useEffect(() => {
          onData(data);
        }, [data]);

        return <></>;
      };

      const defaultState = {
        ...initializeDefaultInMemoryState(),
        entry: {
          entry_1: {
            ...initializeDefaultDocument("entry"),
            entryKey: "entry_1",
          },
        },
      };

      const onData = jest.fn();

      const Component: React.FunctionComponent = () => {
        return (
          <InMemoryStateProviderWithAutosave
            idbWrapper={new IpsumIndexedDBClient(null)}
            stateFromAutosave={defaultState}
          >
            <StatefulComponent>
              <UserComponent onData={onData}></UserComponent>
            </StatefulComponent>
          </InMemoryStateProviderWithAutosave>
        );
      };

      render(<Component></Component>);

      expect(onData).toHaveBeenCalledTimes(2);
      expect(onData.mock.calls[0][0].entry_1).toBeDefined();
      expect(onData.mock.calls[1][0]).toEqual({});
    });
  });
});
