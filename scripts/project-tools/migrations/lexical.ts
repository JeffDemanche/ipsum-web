import { ContentState } from "draft-js";
import { IpsumTimeMachine } from "util/diff";
import { stateToHTML } from "draft-js-export-html";
import { parseContentState } from "util/content-state";

const contentStateToLexicalHTML = (contentState: ContentState) => {
  const html = stateToHTML(contentState, {
    entityStyleFn: (entity) => {
      const highlightIds: string[] = entity
        .getData()
        .textArcAssignments.map((taa: any) => taa.arcAssignmentId);
      console.log(highlightIds);
      return {
        element: "span",
        attributes: { "data-highlight-ids": highlightIds },
      };
    },
  });

  console.log(html);
};

export default function lexical(modifiedData: any) {
  const newEntries: { [key: string]: any } = {};

  Object.entries(modifiedData.entries).forEach(
    ([key, value]: [string, any]) => {
      // const newEntry = { ...value };
      // newEntry.trackedHTMLString = IpsumTimeMachine.create("").toString();
      // newEntries[key] = newEntry;

      contentStateToLexicalHTML(
        parseContentState(
          IpsumTimeMachine.fromString(value.trackedContentState).currentValue
        )
      );
    }
  );

  modifiedData.entries = newEntries;
}
