import styles from "./EditorStyles.less";

export const editorTheme = {
  paragraph: styles["editor-paragraph"],
  quote: styles["editor-quote"],
  heading: {
    h1: styles["editor-heading-h1"],
    h2: styles["editor-heading-h2"],
    h3: styles["editor-heading-h3"],
    h4: styles["editor-heading-h4"],
    h5: styles["editor-heading-h5"],
  },
  text: {
    bold: styles["editor-text-bold"],
    italic: styles["editor-text-italic"],
    overflowed: styles["editor-text-overflowed"],
    hashtag: styles["editor-text-hashtag"],
    underline: styles["editor-text-underline"],
    strikethrough: styles["editor-text-strikethrough"],
    underlineStrikethrough: styles["editor-text-underlineStrikethrough"],
    code: styles["editor-text-code"],
  },
};
