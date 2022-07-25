import { ChangeEvent } from "react";
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
    const element = document.createElement("a");
    element.setAttribute(
      "href",
      "data:text/plain;charset=utf-8," +
        encodeURIComponent(JSON.stringify(state))
    );
    element.setAttribute("download", `${state.journalTitle}.ipsum`);
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }
};

export const readFileToInMemoryState = async (): Promise<InMemoryState> => {
  if (window.electronAPI) {
    const fileContents = await window.electronAPI.openFile();
    const state = JSON.parse(fileContents, stateReviver) as InMemoryState;
    console.log(state);
    return state;
  } else {
    return new Promise<InMemoryState>((resolve, reject) => {
      const element = document.createElement("input");
      element.setAttribute("type", "file");
      element.onchange = (e: Event) => {
        if (
          (e.target as HTMLInputElement).files &&
          (e.target as HTMLInputElement).files.length === 1
        ) {
          const [file] = (e.target as HTMLInputElement).files;
          const reader = new FileReader();
          reader.readAsText(file, "UTF-8");
          reader.onload = (e: ProgressEvent<FileReader>) => {
            const state = JSON.parse(
              e.target.result as string,
              stateReviver
            ) as InMemoryState;
            resolve(state);
          };
        }
      };
      element.click();
    });
  }
};
