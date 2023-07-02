import { ContentState } from "draft-js";
import { IpsumTimeMachine } from "./diff";

const contentStateToTimeMachine = (contentState: ContentState, date?: Date) => {
  return new IpsumTimeMachine().setValueAtDate(
    date ?? new Date(Date.now()),
    JSON.stringify(contentState)
  );
};
