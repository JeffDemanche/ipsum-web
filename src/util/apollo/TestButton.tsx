import React from "react";
import { createEntry } from ".";

export const TestButton: React.FC = () => {
  return (
    <button
      onClick={() => {
        createEntry({ entryKey: "new entry", contentState: "", date: "" });
      }}
    >
      test
    </button>
  );
};
