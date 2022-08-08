import { InMemoryState, stateReviver } from "state/in-memory/in-memory-state";

/**
 * Shows save dialog if the electron API is present or downloads the project
 * through the browser if not.
 */
export const writeInMemoryStateToFile = async (
  state: InMemoryState
): Promise<void> => {
  if (window.electronAPI) {
    await window.electronAPI.saveFile(JSON.stringify(state));
  } else {
    const newHandle = await window.showSaveFilePicker({
      excludeAcceptAllOption: true,
      suggestedName: `${state.journalTitle}.ipsum`,
      types: [
        { description: "Ipsum Files", accept: { "text/plain": [".ipsum"] } },
      ],
    });
    const writableStream = await newHandle.createWritable();
    await writableStream.write(JSON.stringify(state));
    await writableStream.close();
  }
};

export const readFileToInMemoryState = async (): Promise<InMemoryState> => {
  if (window.electronAPI) {
    const fileContents = await window.electronAPI.openFile();
    const state = JSON.parse(fileContents, stateReviver) as InMemoryState;
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
      return JSON.parse(fileText, stateReviver) as InMemoryState;
    }
  }
};
