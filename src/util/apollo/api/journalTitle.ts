import { autosave } from "../autosave";
import { vars } from "../client";

export const updateJournalTitle = (title: string) => {
  vars.journalTitle(title);
  autosave();
};
