import { PathReporter } from "io-ts/PathReporter";

import { serializeVars, vars } from "../apollo/client";
import { SerializedSchema } from "./serializer-schema";

/**
 * Converts Apollo state into a string to be written to disk.
 */
export const writeApolloState = (): string => {
  return JSON.stringify(
    serializeVars.reduce((prev, curr) => {
      return {
        ...prev,
        [curr]: vars[curr](),
      };
    }, {})
  );
};

/**
 * Load a string from disk into Apollo state. Returns an array of validation
 * errors, if they occurred.
 */
export const loadApolloState = (serialized: string): string[] | undefined => {
  const raw = JSON.parse(serialized);
  const parsed = SerializedSchema.decode(raw);

  if (parsed._tag === "Left") {
    PathReporter.report(parsed).forEach((error) => console.error(error));
    return PathReporter.report(parsed);
  } else {
    vars.journalId(parsed.right.journalId);
    vars.journalMetadata(parsed.right.journalMetadata);
    vars.journalTitle(parsed.right.journalTitle);
    vars.entries(parsed.right.entries);
    vars.journalEntries(parsed.right.journalEntries);
    vars.arcEntries(parsed.right.arcEntries);
    vars.commentEntries(parsed.right.commentEntries);
    vars.arcs(parsed.right.arcs);
    vars.highlights(parsed.right.highlights);
    vars.relations(parsed.right.relations);
    vars.comments(parsed.right.comments);
    vars.days(parsed.right.days);
  }
};

export const writeToFile = async (
  content: string,
  options: SaveFilePickerOptions
): Promise<void> => {
  if (window.electronAPI) {
    await window.electronAPI.saveFile(content);
  } else {
    const newHandle = await window.showSaveFilePicker(options);
    const writableStream = await newHandle.createWritable();
    await writableStream.write(content);
    await writableStream.close();
  }
};

export const readFromFile = async (
  options: OpenFilePickerOptions
): Promise<string> => {
  if (window.electronAPI) {
    return await window.electronAPI.openFile();
  } else {
    const [fileHandle] = await window.showOpenFilePicker(options);

    if (fileHandle.kind === "file") {
      const file = await fileHandle.getFile();
      return await file.text();
    }
  }
};
