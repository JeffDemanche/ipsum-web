import { useLazyQuery } from "@apollo/client";
import { DatePickerDayData } from "components/molecules/DatePicker";
import { LexicalFilterSelector } from "components/molecules/LexicalFilterSelector";
import { useState } from "react";
import { gql } from "util/apollo";
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
    day(day: $day) {
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

export const useLexicalFilterSelectorConnected =
  (): LexicalFilterSelectorConnectedProps => {
    const [getDayData] = useLazyQuery(
      LexicalFilterSelectorConnectedDataOnDayQuery
    );

    const [editMode, setEditMode] = useState(false);

    const [programText, setProgramText] = useState(
      'highlights sorted by review status as of "today"'
    );

    const relationChooserProps = useRelationChooserConnected();

    const dataOnDay = async (day: IpsumDay): Promise<DatePickerDayData> => {
      const { data } = await getDayData({
        variables: { day: day.toString("stored-day") },
      });
      return {
        arcs:
          data?.day?.journalEntry?.entry?.highlights?.reduce(
            (prev, cur) => [...prev, ...cur.arcs],
            []
          ) ?? [],
        entry: !!data?.day,
      };
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
      arcByIdOrName: () => {
        return undefined;
      },
    };
  };
