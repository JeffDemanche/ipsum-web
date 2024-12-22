import { generateMock } from "mocks/generate-mock";

import {
  arc001_attachment,
  arc002_knowledge,
  arc003_understanding,
  arc004_asceticism,
  arc005_govinda,
  arc006_journey_of_self_discovery,
  arc007_vasudeva,
  arc008_gotama,
  arc009_enlightenment,
  arc010_the_river,
  arc011_sense_of_purpose,
  arc012_savathi,
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
      arc001_attachment,
      arc002_knowledge,
      arc003_understanding,
      arc004_asceticism,
      arc005_govinda,
      arc006_journey_of_self_discovery,
      arc007_vasudeva,
      arc008_gotama,
      arc009_enlightenment,
      arc010_the_river,
      arc011_sense_of_purpose,
      arc012_savathi,
    ],
  });
};
