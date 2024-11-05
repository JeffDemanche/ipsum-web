import { IpsumDay } from "util/dates";

export interface SRSCardRating {
  day: IpsumDay;
  q: number;

  easeBefore: number;
  easeAfter: number;

  intervalBefore: number;
  intervalAfter: number;
}

export interface SRSCardHistory {
  ratings: ReadonlyArray<SRSCardRating>;
  creationDay: IpsumDay;
}
