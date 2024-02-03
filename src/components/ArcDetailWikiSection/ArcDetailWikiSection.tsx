import { ArcDetailContext, ArcDetailSection } from "components/ArcDetail";
import React, { useContext, useMemo } from "react";
import { EntryType } from "util/apollo";
import { IpsumEditor } from "util/editor";

export const ArcDetailWikiSection: React.FunctionComponent = () => {
  const { arc } = useContext(ArcDetailContext);

  const arcId = arc.id;
  const arcName = arc.name;

  const entryKey = useMemo(() => arc.arcEntry?.entry.entryKey, [arc.arcEntry]);

  return (
    <ArcDetailSection>
      <IpsumEditor
        entryKey={entryKey}
        metadata={{ entryType: EntryType.Arc, arcId, arcName }}
      />
    </ArcDetailSection>
  );
};
