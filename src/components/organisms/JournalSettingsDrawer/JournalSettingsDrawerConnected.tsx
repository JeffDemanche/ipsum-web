import { useQuery } from "@apollo/client";
import React from "react";
import { apiUpdateJournalTitle, useApiAction } from "util/api";
import { gql } from "util/apollo";
import { useIpsumSearchParams, useModifySearchParams } from "util/state";

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

  const modifySearchParams = useModifySearchParams<"journal">();

  const onDrawerOpen = () => {
    modifySearchParams((params) => {
      params.settings = { ...params.settings, open: true };
      return params;
    });
  };

  const onDrawerClose = () => {
    modifySearchParams((params) => {
      params.settings = { ...params.settings, open: false };
      return params;
    });
  };

  const [updateJournalTitle] = useApiAction(apiUpdateJournalTitle);

  const onJournalTitleChange = (value: string) => {
    updateJournalTitle({ title: value });
  };

  const onNew = () => {
    // TODO
  };

  const onSave = () => {
    // TODO
  };

  const onLoad = () => {
    // TODO
  };

  return (
    <JournalSettingsDrawer
      journalTitle={data?.journalTitle ?? "(No title)"}
      onJournalTitleChange={onJournalTitleChange}
      defaultOpen={settingsUrlParams?.open ?? true}
      onOpen={onDrawerOpen}
      onClose={onDrawerClose}
      onNewClick={onNew}
      onSaveClick={onSave}
      onLoadClick={onLoad}
    />
  );
};
