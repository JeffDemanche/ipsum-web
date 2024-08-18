import { generateMock } from "mocks/generate-mock";

import {
  arc1_attachment,
  arc2_knowledge,
  arc3_understanding,
  arc4_asceticism,
  arc5_govinda,
  arc6_journey_of_self_discovery,
  arc7_vasudeva,
} from "./arcs";
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
  return generateMock({
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
    arcs: [
      arc1_attachment,
      arc2_knowledge,
      arc3_understanding,
      arc4_asceticism,
      arc5_govinda,
      arc6_journey_of_self_discovery,
      arc7_vasudeva,
    ],
  });
};
