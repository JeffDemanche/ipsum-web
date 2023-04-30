/**
 * Ex usage: `npm run project-tools --input_file=./projects/[...].ipsum
 * --output_file=./projects/[...].ipsum`
 *
 * Gives us a REPL to make changes to a project file that might be useful for
 * when the schema for project files changes during development.
 */

import { readFileSync, existsSync } from "fs";

import repl from "repl";
import { migrateEntityTextArcAssignments } from "./migrate-entity-text-arc-assignments";
import { prettyPrint } from "./pretty-print";
import { renameField } from "./rename";
import { write } from "./write";

const inputFileArg = process.env.npm_config_input_file;
const outputFileArg = process.env.npm_config_output_file;

if (!existsSync(inputFileArg)) {
  throw new Error(`Input file doesn't exist: ${inputFileArg}`);
}
if (!outputFileArg) {
  throw new Error("No output_file");
}

let data = "";
try {
  data = readFileSync(inputFileArg, { encoding: "utf-8" });
} catch (error) {
  console.error(error);
}

const originalData = JSON.parse(data);
let modifiedData = { ...originalData };

const replServer = repl.start({ prompt: "project-tools => " });

replServer.defineCommand("print_input", {
  help: "Pretty print input project file, optionally include space-separated subfield path",
  action(arg) {
    try {
      prettyPrint(originalData, arg);
    } catch (e) {
      console.error(e);
    }
  },
});
replServer.defineCommand("print_modified", {
  help: "Pretty print the modifications made to the project file, optionally include space-separated subfield path",
  action(arg) {
    try {
      prettyPrint(modifiedData, arg);
    } catch (e) {
      console.error(e);
    }
  },
});
replServer.defineCommand("write", {
  help: "Write modified data to the output file",
  action() {
    try {
      write(modifiedData, outputFileArg);
    } catch (e) {
      console.error(e);
    }
  },
});
replServer.defineCommand("rename_field", {
  help: "Rename a field in the file JSON, format: [path] [to] [field] ... [rename_to]",
  action(arg) {
    try {
      const renamed = { ...modifiedData };
      renameField(renamed, arg);
      modifiedData = renamed;
    } catch (e) {
      console.error(e);
    }
  },
});
replServer.defineCommand("fix_entities", {
  action(arg) {
    try {
      migrateEntityTextArcAssignments(modifiedData, "arc_assignment", "entry");
    } catch (e) {
      console.error(e);
    }
  },
});
replServer.defineCommand("fix_apollo_migration_fields", {
  action(arg) {
    try {
      const highlightsCopy = { ...modifiedData.highlights };
      Object.keys(highlightsCopy).forEach((key) => {
        const arc = highlightsCopy[key].arcId ?? highlightsCopy[key].arc;
        const entry = highlightsCopy[key].entryKey ?? highlightsCopy[key].entry;
        highlightsCopy[key].arc = arc;
        highlightsCopy[key].entry = entry;
        delete highlightsCopy[key].arcId;
        delete highlightsCopy[key].entryKey;
      });
      modifiedData.highlights = highlightsCopy;

      const entriesCopy = { ...modifiedData.entries };
      Object.keys(entriesCopy).forEach((key) => {
        if (entriesCopy[key].date?.["_luxonDateTime"]) {
          console.log(entriesCopy[key].date["_luxonDateTime"]);
          const date =
            entriesCopy[key].date["_luxonDateTime"] ?? entriesCopy[key].date;
          delete entriesCopy[key].date;
          entriesCopy[key].date = date;
        }
      });
      modifiedData.entries = entriesCopy;
    } catch (e) {
      console.error(e);
    }
  },
});
replServer.defineCommand("add_typenames", {
  action() {
    const highlightsCopy = { ...modifiedData.highlights };
    Object.keys(highlightsCopy).forEach((key) => {
      highlightsCopy[key].__typename = "Highlight";
    });

    const entriesCopy = { ...modifiedData.entries };
    Object.keys(entriesCopy).forEach((key) => {
      entriesCopy[key].__typename = "Entry";
    });

    const arcsCopy = { ...modifiedData.arcs };
    Object.keys(arcsCopy).forEach((key) => {
      arcsCopy[key].__typename = "Arc";
    });

    modifiedData.highlights = highlightsCopy;
    modifiedData.entries = entriesCopy;
    modifiedData.arcs = arcsCopy;
  },
});
