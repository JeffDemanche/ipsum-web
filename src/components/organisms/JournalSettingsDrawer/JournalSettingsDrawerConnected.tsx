import { useQuery } from "@apollo/client";
import React, { useContext } from "react";
import {
  apiUpdateJournalTitle,
  urlSetJournalSettingsDrawerOpen,
  useApiAction,
  useUrlAction,
} from "util/api";
import { gql } from "util/apollo";
import { SerializationContext } from "util/serializer";
import { useIpsumSearchParams } from "util/state";

import { JournalSettingsDrawer } from "./JournalSettingsDrawer";

interface JournalSettingsDrawerConnectedProps {}

const JournalSettingsDrawerQuery = gql(`
  query JournalSettingsDrawer {
    journalTitle
  } 
`);

export const JournalSettingsDrawerConnected: React.FC<
  JournalSettingsDrawerConnectedProps
> = () => {
  const { data } = useQuery(JournalSettingsDrawerQuery);

  const { settings: settingsUrlParams } = useIpsumSearchParams<"journal">();

  const setJournalSettingsDrawerOpen = useUrlAction(
    urlSetJournalSettingsDrawerOpen
  );

  const onDrawerOpen = () => {
    setJournalSettingsDrawerOpen(true);
  };

  const onDrawerClose = () => {
    setJournalSettingsDrawerOpen(false);
  };

  const [updateJournalTitle] = useApiAction(apiUpdateJournalTitle);

  const onJournalTitleChange = (value: string) => {
    updateJournalTitle({ title: value });
  };

  const { resetToInitial, saveToFile, loadFromFile } =
    useContext(SerializationContext);

  const onNew = () => {
    resetToInitial();
  };

  const onSave = () => {
    saveToFile();
  };

  const onLoad = () => {
    loadFromFile();
  };

  return (
    <JournalSettingsDrawer
      journalTitle={data?.journalTitle ?? "(No title)"}
      onJournalTitleChange={onJournalTitleChange}
      defaultOpen={(settingsUrlParams?.open ?? true) === "true"}
      onOpen={onDrawerOpen}
      onClose={onDrawerClose}
      onNewClick={onNew}
      onSaveClick={onSave}
      onLoadClick={onLoad}
    />
  );
};
