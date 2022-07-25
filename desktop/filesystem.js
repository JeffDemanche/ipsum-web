const fs = require("fs");
const { dialog } = require("electron");

module.exports = {
  saveFile: async (event, fileData) => {
    const result = await dialog.showSaveDialog({
      filters: [{ name: "Ipsum Journal", extensions: ["ipsum"] }],
    });
    return await fs.promises.writeFile(result.filePath, fileData);
  },

  loadFile: async (event) => {
    const files = await dialog.showOpenDialog({ properties: ["openFile"] });

    if (files === undefined) {
      console.log("No file selected");
      return;
    }

    return await fs.promises.readFile(files.filePaths[0], "utf-8");
  },
};
