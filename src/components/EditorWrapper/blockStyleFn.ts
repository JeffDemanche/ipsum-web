import cx from "classnames";
import { ContentBlock } from "draft-js";
import editorStyes from "./EditorStyles.less";

export const blockStyleFn = (block: ContentBlock) => {
  return cx(editorStyes["editor-block"], {
    [editorStyes["editor-paragraph"]]: block.getType() === "unstyled",
    [editorStyes["editor-header-one"]]: block.getType() === "header-one",
    [editorStyes["editor-unordered-list-item"]]:
      block.getType() === "unordered-list-item",
    [editorStyes["editor-ordered-list-item"]]:
      block.getType() === "ordered-list-item",
    [editorStyes["editor-blockquote"]]: block.getType() === "blockquote",
  });
};
