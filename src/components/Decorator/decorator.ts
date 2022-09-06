import { CompositeDecorator, ContentBlock, ContentState } from "draft-js";
import { ArcDecoration } from "./ArcDecoration";

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

export const decorator = new CompositeDecorator([
  { strategy, component: ArcDecoration },
]);
