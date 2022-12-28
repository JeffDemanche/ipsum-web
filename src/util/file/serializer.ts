import { InMemoryState, stateReviver } from "state/in-memory/in-memory-state";

export const serializeState = (state: InMemoryState) => JSON.stringify(state);

export const deserializeState = (stringData: string) =>
  JSON.parse(stringData, stateReviver) as InMemoryState;

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

/**
 * Shows save dialog if the electron API is present or downloads the project
 * through the browser if not.
 */
export const writeInMemoryStateToFile = async (
  state: InMemoryState
): Promise<void> => {
  if (window.electronAPI) {
    await window.electronAPI.saveFile(serializeState(state));
  } else {
    const newHandle = await window.showSaveFilePicker({
      excludeAcceptAllOption: true,
      suggestedName: `${state.journalTitle}.ipsum`,
      types: [
        { description: "Ipsum Files", accept: { "text/plain": [".ipsum"] } },
      ],
    });
    const writableStream = await newHandle.createWritable();
    await writableStream.write(serializeState(state));
    await writableStream.close();
  }
};

export const readFileToInMemoryState = async (): Promise<InMemoryState> => {
  if (window.electronAPI) {
    const fileContents = await window.electronAPI.openFile();
    const state = deserializeState(fileContents);
    return state;
  } else {
    const [fileHandle] = await window.showOpenFilePicker({
      excludeAcceptAllOption: true,
      multiple: false,
      types: [
        { description: "Ipsum Files", accept: { "text/plain": [".ipsum"] } },
      ],
    });

    if (fileHandle.kind === "file") {
      const file = await fileHandle.getFile();
      const fileText = await file.text();
      return deserializeState(fileText);
    }
  }
};
