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
