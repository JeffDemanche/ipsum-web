export interface FormattableEditor {
  setBold: (bold: boolean) => void;
  setItalic: (italic: boolean) => void;
  setUnderline: (underline: boolean) => void;
}

export interface FormattingControlsContextType {
  activeEditor: FormattableEditor | null;
  setActiveEditor: (editor: FormattableEditor | null) => void;
}
