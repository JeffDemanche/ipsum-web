import { autosave } from "util/serializer";

import { vars } from "../client";

export const updateJournalTitle = (title: string) => {
  vars.journalTitle(title);
  autosave();
};
