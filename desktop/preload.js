const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  saveFile: (fileData) => ipcRenderer.invoke("dialog:saveFile", fileData),
  openFile: () => ipcRenderer.invoke("dialog:openFile"),
});
