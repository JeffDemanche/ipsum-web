import { IpsumFilteringProgramV1 } from "./ipsum-filtering-program-v1";

type IFLVersion = "v1";

export const createFilteringProgram = (version: IFLVersion) => {
  switch (version) {
    case "v1":
      return new IpsumFilteringProgramV1();
  }
};
