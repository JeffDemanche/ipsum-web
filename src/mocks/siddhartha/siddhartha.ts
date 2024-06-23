import { generateMock } from "mocks/generate-mock";

import {
  journalEntry1_TheSonOfTheBrahman,
  journalEntry2_WithTheSamanas,
  journalEntry3_Gotama,
  journalEntry4_Awakening,
  journalEntry5_Kamala,
  journalEntry6_WithTheChildlikePeople,
  journalEntry7_Sansara,
  journalEntry8_ByTheRiver,
  journalEntry9_TheFerryman,
  journalEntry10_TheSon,
  journalEntry11_Om,
  journalEntry12_Govinda,
} from "./journal-entries";

export const mockSiddhartha = () => {
  generateMock({
    journalEntries: [
      journalEntry1_TheSonOfTheBrahman,
      journalEntry2_WithTheSamanas,
      journalEntry3_Gotama,
      journalEntry4_Awakening,
      journalEntry5_Kamala,
      journalEntry6_WithTheChildlikePeople,
      journalEntry7_Sansara,
      journalEntry8_ByTheRiver,
      journalEntry9_TheFerryman,
      journalEntry10_TheSon,
      journalEntry11_Om,
      journalEntry12_Govinda,
    ],
  });
};
