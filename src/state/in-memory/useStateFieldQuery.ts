import { useContext, useEffect, useState } from "react";
import { InMemoryStateContext } from "./in-memory-context";
import { TopLevelField, TopLevelFieldName } from "./in-memory-schema";
import { v4 as uuidv4 } from "uuid";

interface UseStateFieldQueryArgs<T extends TopLevelFieldName> {
  field: T;
}

interface UseStateFieldQueryResult<F extends TopLevelFieldName> {
  data: TopLevelField<F>;
}

export const useStateFieldQuery = <F extends TopLevelFieldName>(
  args: UseStateFieldQueryArgs<F>
): UseStateFieldQueryResult<F> => {
  const { state, addFieldBroadcaster, removeFieldBroadcaster } =
    useContext(InMemoryStateContext);

  const [id] = useState(uuidv4);

  const [data, setData] = useState<TopLevelField<F>>(
    state[args.field] as TopLevelField<F>
  );

  useEffect(() => {
    addFieldBroadcaster({
      id,
      type: "field",
      field: args.field,
      broadcast: (field) => {
        setData(field);
      },
    });

    return () => {
      removeFieldBroadcaster(id);
    };
    // Adding the broadcaster functions would make this run every render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, args.field]);

  return { data };
};
