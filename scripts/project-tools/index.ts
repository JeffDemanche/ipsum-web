/**
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

if (!existsSync(inputFileArg) || !outputFileArg) {
  throw new Error("specify input_file and output_file");
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
  help: "Write modified data to the output file",
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
