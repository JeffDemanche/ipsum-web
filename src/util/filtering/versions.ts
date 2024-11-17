import { IpsumFilteringProgramV1 } from "./v1-filtering-program";

type IFLVersion = "v1";

export const createFilteringProgram = (version: IFLVersion) => {
  switch (version) {
    case "v1":
      return new IpsumFilteringProgramV1();
  }
};
