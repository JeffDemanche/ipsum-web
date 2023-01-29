import util from "util";

export const prettyPrint = (data: any, objectPathArg?: string) => {
  let selectedData = { ...data };

  if (objectPathArg) {
    const objectPath = objectPathArg.split(" ");
    objectPath.forEach((field) => {
      if (selectedData[field]) selectedData = selectedData[field];
      else throw new Error("No object path");
    });
  }

  console.log(
    util.inspect(selectedData, { showHidden: true, depth: null, colors: true })
  );
};
