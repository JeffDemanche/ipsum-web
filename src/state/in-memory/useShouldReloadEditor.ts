import { useContext } from "react";
import { InMemoryStateContext } from "./in-memory-context";

export const useShouldReloadEditor = () => {
  const { shouldReloadEditor } = useContext(InMemoryStateContext);

  return { shouldReloadEditor };
};
