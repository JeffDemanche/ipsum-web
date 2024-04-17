import { BlockType } from "components/atoms/EntryEditor/types";

export interface FormattableEditor {
  isFocused: boolean;
  restoreFocus: () => void;

  bold: boolean;
  setBold: React.Dispatch<React.SetStateAction<boolean>>;

  italic: boolean;
  setItalic: React.Dispatch<React.SetStateAction<boolean>>;

  underline: boolean;
  setUnderline: React.Dispatch<React.SetStateAction<boolean>>;

  strikethrough: boolean;
  setStrikethrough: React.Dispatch<React.SetStateAction<boolean>>;

  link: boolean;
  setLink: React.Dispatch<React.SetStateAction<boolean>>;

  blockType: BlockType;
  setBlockType: React.Dispatch<React.SetStateAction<BlockType>>;

  createHighlight: () => void;
}

export interface FormattingControlsContextType {
  activeEditor: FormattableEditor | null;
  setActiveEditor: ((editor: FormattableEditor | null) => void) | null;
}
