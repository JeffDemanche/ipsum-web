/**
 * Ex usage: `npm run project-tools --input_file=./projects/[...].ipsum
 * --output_file=./projects/[...].ipsum`
 *
 * Gives us a REPL to make changes to a project file that might be useful for
 * when the schema for project files changes during development.
 */

import { readFileSync, existsSync } from "fs";

import repl from "repl";
import { prettyPrint } from "./pretty-print";
import { renameField } from "./rename";
import { write } from "./write";
import { SerializedSchema } from "../../src/util/apollo/serializer-schema";
import { PathReporter } from "io-ts/lib/PathReporter";
import { migrateArcEntries } from "./migrations/arc-entries-migration";
import { migrateSRS } from "./migrations/srs-migration";
import { createDayObject } from "./migrations/create-day-object";

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
let modifiedData = JSON.parse(data);

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
replServer.defineCommand("validate", {
  action(arg) {
    try {
      const parsed = SerializedSchema.decode(modifiedData);

      if (parsed._tag === "Left") {
        PathReporter.report(parsed).forEach((error) => console.error(error));
      } else {
        console.log("Passed validation!");
      }
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
replServer.defineCommand("migrate_arc_entries", {
  action() {
    migrateArcEntries(modifiedData);
  },
});
replServer.defineCommand("migrate_srs", {
  action() {
    migrateSRS(modifiedData);
  },
});
replServer.defineCommand("create_days", {
  action() {
    createDayObject(modifiedData);
  },
});
