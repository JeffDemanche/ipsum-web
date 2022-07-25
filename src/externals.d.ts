declare module "*.less";

// See desktop/preload.js
declare interface Window {
  electronAPI: {
    saveFile: (fileData: string) => Promise<void>;
    openFile: () => Promise<string>;
  };
}
