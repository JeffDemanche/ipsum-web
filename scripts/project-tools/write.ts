import { writeFileSync } from "fs";

export const write = (data: object, outputFile: string) => {
  writeFileSync(outputFile, JSON.stringify(data));
};
