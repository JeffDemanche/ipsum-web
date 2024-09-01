import { StaticInMemoryProjectState } from "util/state";

type ValidatorStepResult =
  | { result: "pass" }
  | { result: "fail"; message: string };

interface ValidatorStep {
  description: string;
  fn: (value: StaticInMemoryProjectState) => ValidatorStepResult;
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
];

interface ValidatorResult {
  result: "pass" | "fail";
  messages?: string[];
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
    };
  }

  return { result: "pass" };
};
