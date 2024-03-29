import React, { useEffect, useState } from "react";

interface JournalHotkeysContextData {
  ctrlKey: boolean;
}

const defaultJournalHotkeysContextData: JournalHotkeysContextData = {
  ctrlKey: false,
};

export const JournalHotkeysContext =
  React.createContext<JournalHotkeysContextData>(
    defaultJournalHotkeysContextData
  );

interface JournalHotkeysProviderProps {
  children: React.ReactNode;
}

export const JournalHotkeysProvider: React.FunctionComponent<
  JournalHotkeysProviderProps
> = ({ children }: JournalHotkeysProviderProps) => {
  const [ctrlKey, setCtrlKey] = useState(false);

  useEffect(() => {
    const docKeyEvent = (e: KeyboardEvent) => {
      setCtrlKey(e.metaKey || e.ctrlKey);
    };

    document.addEventListener("keydown", docKeyEvent);
    document.addEventListener("keyup", docKeyEvent);

    return () => {
      document.removeEventListener("keydown", docKeyEvent);
      document.removeEventListener("keyup", docKeyEvent);
    };
  }, []);

  return (
    <JournalHotkeysContext.Provider value={{ ctrlKey: ctrlKey }}>
      {children}
    </JournalHotkeysContext.Provider>
  );
};
