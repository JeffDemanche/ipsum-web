import { diff_match_patch } from "diff-match-patch";
import {
  compareDatesAsc,
  compareDatesDesc,
  IpsumDateTime,
  sortDates,
} from "util/dates";
import { PatchesMap, StringifiedTimeMachine, TimeMachine } from "./types";

/**
 * Wrapper for Google's `diff-match-patch` library which augments the
 * functionality to Ipsum's use cases. That is, creating and applying text diffs
 * pegged to a date when the diff was created. This can be used e.g. for
 * tracking changes to an entry for a specific date.
 */
export class IpsumTimeMachine {
  private _differ = new diff_match_patch();

  private _initialText: string;
  private _patchData: PatchesMap;
  private _currentValue: string;

  private _sortedPatchKeys: string[];

  constructor({
    initialText,
    patchData,
    currentText,
  }: Partial<TimeMachine> = {}) {
    this._initialText = initialText ?? "";
    this._patchData = patchData ?? {};
    this._currentValue = currentText ?? this._initialText;

    this.sortPatchKeys();
  }

  private copy(): IpsumTimeMachine {
    return new IpsumTimeMachine({
      initialText: this._initialText,
      patchData: this._patchData,
      currentText: this._currentValue,
    });
  }

  private sortPatchKeys(): void {
    this._sortedPatchKeys = sortDates(
      Object.keys(this._patchData).map((dateString) =>
        IpsumDateTime.fromString(dateString, "entry-printed-date")
      ),
      true
    ).map((idt) => idt.toString("entry-printed-date"));
  }

  private getPatchKeyForDateString(date: string): string {
    return this._sortedPatchKeys
      .slice()
      .reverse()
      .find(
        (patchKey) =>
          compareDatesDesc(
            IpsumDateTime.fromString(date, "entry-printed-date"),
            IpsumDateTime.fromString(patchKey, "entry-printed-date")
          ) < 1
      );
  }

  private getPreviousValue(date: string): string {
    const patchKey = this.getPatchKeyForDateString(date);

    const dateIndex = this._sortedPatchKeys.indexOf(patchKey);
    const previousDateIndex = dateIndex - 1;

    if (dateIndex === undefined || previousDateIndex < 0) {
      return undefined;
    }

    return this.valueAtDateString(this._sortedPatchKeys[previousDateIndex]);
  }

  /**
   * @param dateString The date string to get the value for. If the date is not
   * found,
   * @returns The value of the TimeMachine at the given date. If the date is
   * before the first entry or if no entry exists, returns undefined.
   */
  valueAtDateString(dateString: string) {
    const patchKey = this.getPatchKeyForDateString(dateString);

    const dateIndex = this._sortedPatchKeys.indexOf(patchKey);

    if (dateIndex === -1) {
      return undefined;
    }

    const appliedPatches = this._sortedPatchKeys
      .slice(0, dateIndex + 1)
      .reduce((acc, curr) => {
        const [result, successful] = this._differ.patch_apply(
          this._patchData[curr],
          acc
        );
        return result;
      }, this._initialText);

    return appliedPatches;
  }

  /**
   * @see valueAtDateString
   */
  valueAtDate(date: Date) {
    const dateString =
      IpsumDateTime.fromJsDate(date).toString("entry-printed-date");

    return this.valueAtDateString(dateString);
  }

  /**
   * Does not modify.
   *
   * @param date The date at which the TimeMachine starts returning the given
   * value.
   * @param value The value to return starting at given date.
   * @returns A copy of the TimeMachine with the given value set at the given.
   */
  setValueAtDate(date: Date, value: string): IpsumTimeMachine {
    const copy = this.copy();

    const dateString =
      IpsumDateTime.fromJsDate(date).toString("entry-printed-date");

    const mostRecentPatchKey =
      copy._sortedPatchKeys[copy._sortedPatchKeys.length - 1];

    if (
      copy._sortedPatchKeys.length > 0 &&
      compareDatesAsc(
        IpsumDateTime.fromJsDate(date),
        IpsumDateTime.fromString(mostRecentPatchKey, "entry-printed-date")
      ) === -1
    ) {
      throw new Error("Cannot set value for date before last patch date");
    } else if (
      copy._sortedPatchKeys.length > 0 &&
      mostRecentPatchKey === dateString
    ) {
      // Remove the most recent patch from the patch key map.
      copy._currentValue =
        copy.getPreviousValue(dateString) ?? copy._initialText;
      const sortedCopy = [...copy._sortedPatchKeys];
      sortedCopy.pop();
      copy._sortedPatchKeys = sortedCopy;
    }

    const diffs = copy._differ.diff_main(copy._currentValue, value);

    const patches = copy._differ.patch_make(diffs);

    copy._patchData[dateString] = patches;
    copy._sortedPatchKeys = [...copy._sortedPatchKeys, dateString];

    copy._currentValue = value;

    return copy;
  }

  serialize(): StringifiedTimeMachine {
    return {
      initialText: this._initialText,
      patchData: JSON.stringify(this._patchData),
      currentText: this._currentValue,
    };
  }

  toString(): string {
    return JSON.stringify(this.serialize());
  }

  static fromString(stringifiedTimeMachine: string): IpsumTimeMachine {
    const parsed: StringifiedTimeMachine = JSON.parse(stringifiedTimeMachine);

    return new IpsumTimeMachine({
      initialText: parsed.initialText,
      patchData: JSON.parse(parsed.patchData),
      currentText: parsed.currentText,
    });
  }
}
