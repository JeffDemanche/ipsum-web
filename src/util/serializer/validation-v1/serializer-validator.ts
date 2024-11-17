import { StaticInMemoryProjectState } from "util/state";

type ValidatorStepResult =
  | { result: "pass" }
  | { result: "fail"; message: string };

interface ValidatorStep {
  description: string;
  fn: (value: StaticInMemoryProjectState) => ValidatorStepResult;
  fix?: (value: StaticInMemoryProjectState) => StaticInMemoryProjectState;
}

const steps: ValidatorStep[] = [
  {
    description: "Ensure every daily journal entry has a day object",
    fn: (value) => {
      const journalEntriesWithNoDays = Object.values(
        value.journalEntries
      ).filter((je) =>
        Object.values(value.days).every((day) => day.day !== je.entryKey)
      );

      if (journalEntriesWithNoDays.length === 0) {
        return { result: "pass" };
      }

      return {
        result: "fail",
        message: `The following entries have no corresponding day object: ${journalEntriesWithNoDays
          .map((entry) => entry.entryKey)
          .join(", ")}`,
      };
    },
  },
  {
    description: "Ensure every highlight belongs to an entry that exists",
    fn: (value) => {
      const highlightsWithNoEntries = Object.values(value.highlights).filter(
        (highlight) => !Object.keys(value.entries).includes(highlight.entry)
      );

      if (highlightsWithNoEntries.length === 0) {
        return { result: "pass" };
      }

      return {
        result: "fail",
        message: `The following highlights have no corresponding entry: ${highlightsWithNoEntries
          .map((highlight) => highlight.id)
          .join(", ")}`,
      };
    },
    fix: (value) => {
      const fixedValue = { ...value };

      for (const highlight of Object.values(value.highlights)) {
        if (!Object.keys(value.entries).includes(highlight.entry)) {
          console.log("[FIX] Removing highlight:", highlight.id);
          delete fixedValue.highlights[highlight.id];
        }
      }

      return fixedValue;
    },
  },
];

export interface ValidatorResult {
  result: "pass" | "fail";
  messages?: string[];
  fix?: () => StaticInMemoryProjectState;
}

export const validate = (
  value: StaticInMemoryProjectState
): ValidatorResult => {
  const results = steps.map((step) => step.fn(value));

  const failed = results.filter((result) => result.result === "fail");

  if (failed.length > 0) {
    return {
      result: "fail",
      messages: failed.map(
        (result) => result.result === "fail" && result.message
      ),
      fix: () => {
        let fixedValue = { ...value };

        for (const step of steps) {
          const result = step.fn(fixedValue);

          if (result.result === "fail") {
            fixedValue = step.fix?.(fixedValue) ?? fixedValue;
          }
        }

        return fixedValue;
      },
    };
  }

  return { result: "pass" };
};
