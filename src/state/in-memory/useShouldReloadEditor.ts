import { useContext } from "react";
import { InMemoryStateContext } from "./SCH_in-memory-context";

export const useShouldReloadEditor = () => {
  const { shouldReloadEditor } = useContext(InMemoryStateContext);

  return { shouldReloadEditor };
};
