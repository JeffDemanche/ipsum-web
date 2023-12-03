import util from "util";
import { IpsumTimeMachine } from "util/diff";

export const prettyPrint = (data: any, objectPathArg?: string) => {
  let selectedData = { ...data };

  if (objectPathArg) {
    const objectPath = objectPathArg.split(" ");
    objectPath.forEach((field) => {
      if (selectedData[field]) {
        if (field.startsWith("tracked")) {
          const timeMachine = IpsumTimeMachine.fromString(selectedData[field]);
          selectedData = timeMachine.toRecord();
        } else {
          selectedData = selectedData[field];
        }
      } else throw new Error("No object path");
    });
  }

  console.log(
    util.inspect(selectedData, { showHidden: true, depth: null, colors: true })
  );
};
