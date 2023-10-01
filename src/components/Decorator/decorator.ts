import { CompositeDecorator, ContentBlock, ContentState } from "draft-js";
import { HighlightDecoration } from "./HighlightDecoration";

const strategy = (
  contentBlock: ContentBlock,
  callback: (start: number, end: number) => void,
  contentState: ContentState
) => {
  contentBlock.findEntityRanges((character) => {
    const entityKey = character.getEntity();
    return (
      entityKey !== null &&
      contentState.getEntity(entityKey).getType() === "ARC"
    );
  }, callback);
};

export const decorator = (entryKey: string) =>
  new CompositeDecorator([
    { strategy, component: HighlightDecoration, props: { entryKey } },
  ]);
