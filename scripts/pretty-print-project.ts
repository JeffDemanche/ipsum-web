import { readFileSync } from "fs";
import util from "util";

const path = process.argv[2];

const data = readFileSync(path, { encoding: "utf-8" });

const object = JSON.parse(data);

Object.keys(object.entries).forEach((entryKey) => {
  const entry = object.entries[entryKey];
  object.entries[entryKey] = {
    ...entry,
    contentState: JSON.parse(entry.contentState),
  };
});

console.log(
  util.inspect(object, { showHidden: true, depth: null, colors: true })
);
