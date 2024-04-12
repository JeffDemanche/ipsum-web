import { ArcDetailContext, ArcDetailSection } from "components/ArcDetail";
import React, { useContext, useMemo } from "react";
import { createArcEntry, EntryType, updateEntry } from "util/apollo";
import { IpsumEditor } from "util/editor";

export const ArcDetailWikiSection: React.FunctionComponent = () => {
  const { arc } = useContext(ArcDetailContext);

  const arcId = arc.id;
  const arcName = arc.name;

  const entryKey = useMemo(() => arc.arcEntry?.entry.entryKey, [arc.arcEntry]);

  return (
    <ArcDetailSection>
      <IpsumEditor
        defaultEntryKey={entryKey}
        createEntry={(htmlString) => {
          const { entry } = createArcEntry({
            arcId,
            arcName,
            htmlString,
          });
          return entry;
        }}
        updateEntry={({ entryKey, htmlString }) => {
          return !!updateEntry({ entryKey, htmlString });
        }}
        deleteEntry={() => {
          // Nothing rn.
        }}
        metadata={{ entryType: EntryType.Arc, arcId, arcName }}
      />
    </ArcDetailSection>
  );
};
