import { patch_obj } from "diff-match-patch";

export interface TimeMachine {
  initialText: string;
  patchData: PatchesMap;
  currentText: string;
}

export interface StringifiedTimeMachine {
  initialText: string;
  patchData: string;
  currentText: string;
}

export interface PatchesMap {
  [date: string]: patch_obj[];
}
