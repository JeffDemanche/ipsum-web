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
replServer.defineCommand("run_script", {
  action(arg) {
    try {
      const script = require(`./migrations/${arg}`);
      script.default(modifiedData);
    } catch (e) {
      console.error(e);
    }
  },
});

/**
 * Removes relations with undefined subjects or objects.
 */
replServer.defineCommand("cull_relations", {
  action() {
    const relationsCopy = { ...modifiedData.relations };

    Object.values(relationsCopy).forEach((relation: any) => {
      if (relation.objectType === "Arc") {
        const arc = modifiedData.arcs[relation.object];
        if (!arc) {
          delete relationsCopy[relation.id];
        }
      }
      if (relation.objectType === "Highlight") {
        const highlight = modifiedData.highlights[relation.object];
        if (!highlight) {
          delete relationsCopy[relation.id];
        }
      }
      if (relation.subjectType === "Arc") {
        const arc = modifiedData.arcs[relation.subject];
        if (!arc) {
          delete relationsCopy[relation.id];
        }
      }
      if (relation.subjectType === "Highlight") {
        const highlight = modifiedData.highlights[relation.subject];
        if (!highlight) {
          delete relationsCopy[relation.id];
        }
      }
    });

    modifiedData.relations = relationsCopy;
  },
});
