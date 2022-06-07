import { ContentState, convertFromRaw, convertToRaw } from "draft-js";

export const stringifyContentState = (contentState: ContentState) =>
  JSON.stringify(convertToRaw(contentState));

export const parseContentState = (contentState: string): ContentState =>
  convertFromRaw(JSON.parse(contentState));
