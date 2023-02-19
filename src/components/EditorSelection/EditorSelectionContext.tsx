import { SurfaceEditorContext } from "components/Surface";
import React, { useCallback, useContext, useMemo } from "react";
import { IpsumSelectionState } from "util/selection";

interface EditorSelectionContextData {
  getSelection(editorKey: string): IpsumSelectionState;
}

export const EditorSelectionContext =
  React.createContext<EditorSelectionContextData>({
    getSelection: () => null,
  });

interface EditorSelectionProviderProps {
  children: React.ReactNode;
}

/**
 * Provides to editor components stateful data about what, if anything, is
 * selected within that component.
 */
export const EditorSelectionProvider: React.FC<
  EditorSelectionProviderProps
> = ({ children }: EditorSelectionProviderProps) => {
  const { entryEditorStates, entryEditorRefs } =
    useContext(SurfaceEditorContext);

  // Maps entry keys to IpsumSelectionStates for that editor.
  const entrySelectionStates: ReadonlyMap<string, IpsumSelectionState> =
    useMemo(() => {
      const map = new Map<string, IpsumSelectionState>();
      entryEditorStates.forEach((editorState, key) => {
        map.set(
          key,
          new IpsumSelectionState(
            editorState.getSelection(),
            IpsumSelectionState.rangeFromDocument(),
            entryEditorRefs.get(key)
          )
        );
      });
      return map;
    }, [entryEditorRefs, entryEditorStates]);

  const getSelection = useCallback(
    (editorKey: string) => {
      return entrySelectionStates.get(editorKey);
    },
    [entrySelectionStates]
  );

  return (
    <EditorSelectionContext.Provider value={{ getSelection }}>
      {children}
    </EditorSelectionContext.Provider>
  );
};
