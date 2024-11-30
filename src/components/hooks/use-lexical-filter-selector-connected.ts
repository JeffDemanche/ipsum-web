import { DatePickerDayData } from "components/molecules/DatePicker";
import { LexicalFilterSelector } from "components/molecules/LexicalFilterSelector";
import { useState } from "react";
import { client, gql } from "util/apollo";
import { IpsumDay } from "util/dates";

import { useRelationChooserConnected } from "./use-relation-chooser-connected";

export type LexicalFilterSelectorConnectedProps = Pick<
  React.ComponentProps<typeof LexicalFilterSelector>,
  | "editMode"
  | "onEnterEditMode"
  | "onLeaveEditMode"
  | "programText"
  | "onFilterProgramChange"
  | "relationChooserProps"
  | "dataOnDay"
  | "arcByIdOrName"
>;

const LexicalFilterSelectorConnectedDataOnDayQuery = gql(`
  query LexicalFilterSelectorConnectedDataOnDay($day: String!) {
    day(day: $day) @client {
      journalEntry {
        entry {
          entryKey
          highlights {
            id
            arcs {
              id
              name
              color
            }
          }
        }
      }
    }
  }
`);

const LexicalFilterSelectorConnectedArcByIdOrNameQuery = gql(`
  query LexicalFilterSelectorConnectedArcByIdOrName($id: ID!, $name: String!) {
    arc(id: $id) {
      id
      name
      color
    }
    arcByName(name: $name) {
      id
      name
      color
    }
  }
`);

export const useLexicalFilterSelectorConnected =
  (): LexicalFilterSelectorConnectedProps => {
    const [editMode, setEditMode] = useState(false);

    const [programText, setProgramText] = useState(
      'highlights sorted by review status as of "today"'
    );

    const relationChooserProps = useRelationChooserConnected({
      subjectType: "None",
    });

    const dataOnDay = (day: IpsumDay): DatePickerDayData => {
      const data = client.readQuery({
        query: LexicalFilterSelectorConnectedDataOnDayQuery,
        variables: { day: day.toString("stored-day") },
      });

      return {
        arcs:
          data?.day?.journalEntry?.entry?.highlights?.reduce(
            (prev, cur) => [
              ...prev,
              ...cur.arcs.map((arc) => ({ ...arc, hue: arc.color })),
            ],
            [] as DatePickerDayData["arcs"]
          ) ?? [],
        entry: !!data?.day,
      };
    };

    const arcByIdOrName = (idOrName: string) => {
      const arcsData = client.readQuery({
        query: LexicalFilterSelectorConnectedArcByIdOrNameQuery,
        variables: { id: idOrName, name: idOrName },
      });

      if (arcsData?.arc) {
        return arcsData.arc;
      } else if (arcsData?.arcByName) {
        return arcsData.arcByName;
      }
      return null;
    };

    const onEnterEditMode = () => {
      setEditMode(true);
    };

    const onLeaveEditMode = () => {
      setEditMode(false);
    };

    return {
      editMode,
      onEnterEditMode,
      onLeaveEditMode,
      programText,
      onFilterProgramChange: (programText) => {
        setProgramText(programText);
      },
      relationChooserProps,
      dataOnDay,
      arcByIdOrName,
    };
  };
