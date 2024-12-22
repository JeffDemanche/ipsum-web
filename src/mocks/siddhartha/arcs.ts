import type { MockedArc } from "mocks/types";
import { IpsumDay } from "util/dates";

export const arc1_attachment: MockedArc = {
  id: "arc1_attachment",
  name: "attachment",
  hue: 0,
  arcEntry: {
    sections: [
      "Attachment is the binding force that ties us to the transient world, hindering our journey towards enlightenment. It is the emotional and material clinging that traps the soul in a cycle of desire, suffering, and discontent. Throughout my journey, I have learned that attachment arises from our desires and fears, keeping us entangled in illusions and preventing us from experiencing true freedom and inner peace. By recognizing and releasing these attachments, whether to people, possessions, or even ideas, we can cultivate a deeper understanding of ourselves and the universe. This detachment does not mean abandoning love or compassion; rather, it means loving without possessing, and living without the fear of loss. In the stillness of the river's flow, I have discovered that true serenity and fulfillment come not from holding on, but from letting go and embracing the continuous, ever-changing nature of life.",
    ],
  },
};

export const arc2_knowledge: MockedArc = {
  id: "arc2_knowledge",
  name: "knowledge",
  hue: 13,
  arcEntry: {
    sections: [
      "Knowledge is not merely the accumulation of facts or doctrines but a profound, experiential understanding of the world and oneself. My travels have shown me that true knowledge cannot be conveyed through words or teachings alone; it must be lived and felt deeply. In my youth, I sought knowledge through rigorous study and spiritual practice, believing that enlightenment could be attained through intellectual mastery. However, as I journeyed through life, from the ascetic disciplines of the Samanas to the material excesses of the city, I realized that each experience, each mistake, and each moment of suffering and joy added to my understanding.",

      "It was through living fully—embracing love, loss, pleasure, and pain—that I came to see the interconnectedness of all things and the unity of existence. The river, with its ceaseless flow and timeless wisdom, became my greatest teacher, showing me that true knowledge is a harmonious blend of inner silence, deep listening, and intuitive insight. Ultimately, knowledge is the awakening to the truth that resides within and around us, a truth that transcends words and can only be known through the heart and soul's direct experience.",
    ],
  },
};

export const arc3_understanding: MockedArc = {
  id: "arc3_understanding",
  name: "understanding",
  hue: 172,
  arcEntry: {
    sections: [
      "Understanding is the deep, intuitive realization that transcends mere knowledge and intellectual comprehension. It is a profound sense of harmony and connection with the essence of life, achieved through direct experience and inner contemplation. My travels have shown me that understanding cannot be taught by others or found in scriptures alone; it must be discovered within oneself.",
      {
        highlight: {
          id: "highlight-understanding-p-3",
          hue: 172,
          entryKey: "arc-entry:understanding:arc3_understanding",
          dayCreated: IpsumDay.fromString("1/1/2020", "entry-printed-date"),
          comments: [],
          outgoingRelations: [
            {
              id: "relation-highlight-understanding-p-3-arc4_asceticism",
              arcId: "arc4_asceticism",
              predicate: "relates to",
            },
          ],
        },
        text: "In my youth, I sought understanding through rigorous spiritual practices and the teachings of renowned sages. Yet, true understanding eluded me as I moved through the stages of asceticism, indulgence, and despair. It was only by immersing myself fully in the experiences of life—embracing both joy and suffering—that I began to grasp the deeper truths.",
      },

      "The river, with its perpetual flow and serene presence, became a mirror reflecting the nature of existence. It taught me that understanding comes from observing and being present with what is, without judgment or attachment. In moments of stillness and deep listening, I found a sense of unity with all things, recognizing that the same life force flows through me, the river, and all of creation.",

      "Understanding, therefore, is the realization of this interconnectedness and the acceptance of life's impermanence and constant change. It is a state of being where the boundaries between self and the world dissolve, leading to a profound peace and acceptance of the present moment. Through my travels, I have learned that true understanding is an ever-evolving journey, a continual awakening to the deeper rhythms of life.",
    ],
  },
};

export const arc4_asceticism: MockedArc = {
  id: "arc4_asceticism",
  name: "asceticism",
  hue: 92,
  arcEntry: {
    sections: [
      "Asceticism is a path of rigorous self-denial and discipline aimed at transcending the desires and distractions of the material world. My travels through this path, especially during my time with the Samanas, taught me the value of detachment and the strength found in renouncing worldly pleasures. Asceticism involves stripping away the superficial layers of existence, fasting, meditating, and enduring physical hardships to purify the soul and seek spiritual enlightenment.",

      "In my youth, I believed that by rejecting all physical comforts and practicing extreme austerity, I could attain higher wisdom and spiritual liberation. For years, I lived a life of deprivation, hoping to conquer the self and dissolve into the universal spirit. However, my journey through asceticism revealed its limitations. Despite the intense practices, I found that mere self-denial did not bring me closer to true understanding or inner peace.",

      "It was through these experiences that I learned that while asceticism can discipline the body and mind, it is not the ultimate path to enlightenment. True spiritual growth requires embracing the fullness of life, including its pleasures and pains, rather than fleeing from them. Asceticism is a valuable teacher, showing the strength and resolve within, but it must be balanced with a deeper, more holistic approach to understanding oneself and the world. Through my travels, I realized that enlightenment comes from integrating all aspects of life, not just rejecting them.",
    ],
  },
};

export const arc5_govinda: MockedArc = {
  id: "arc5_govinda",
  name: "govinda",
  hue: 34,
  arcEntry: {
    sections: [
      {
        text: "From my perspective, my relationship with Govinda has been one of deep connection and mutual growth, though our paths have often diverged. Govinda has been my loyal friend since childhood, a fellow seeker who, like me, yearned for spiritual awakening. He followed me through the different stages of my journey—from our early days as Brahmins, to the harsh life of asceticism with the Samanas, and eventually to the teachings of Gotama, the Buddha.",
        highlight: {
          id: "highlight-govinda-p-0",
          hue: 34,
          entryKey: "arc-entry:govinda:arc5_govinda",
          dayCreated: IpsumDay.fromString("1/1/2020", "entry-printed-date"),
          comments: [],
          outgoingRelations: [
            {
              id: "relation-highlight-govinda-p-0-arc6_journey_of_self_discovery",
              arcId: "arc6_journey_of_self_discovery",
              predicate: "relates to",
            },
          ],
        },
      },

      "Yet, while our friendship has always been strong, our spiritual paths have differed. Govinda found solace in following teachers and doctrines, finding meaning in devotion and loyalty to a specific path, such as the Buddha's teachings. I, on the other hand, felt the need to explore life independently, guided by my own experiences and inner voice.",

      "Throughout the years, Govinda has remained dedicated to his search for enlightenment, while I wandered through different realms of existence—asceticism, pleasure, and simplicity by the river. Despite these differences, our bond has endured, shaped by mutual respect and shared memories. Govinda represents a part of me that seeks answers in established truths, while I have come to trust in the fluid and personal nature of the journey.",

      "When our paths crossed again in later years, it was clear that although we had chosen different approaches to our spiritual quests, our connection remained unbroken. Govinda will always be a brother to me—a reflection of the seeker I once was, and a reminder of the many ways one can pursue the truth.",
    ],
  },
};

export const arc6_journey_of_self_discovery: MockedArc = {
  id: "arc6_journey_of_self_discovery",
  name: "journey of self discovery",
  hue: 236,
  arcEntry: {
    sections: [],
  },
};

export const arc7_vasudeva: MockedArc = {
  id: "arc7_vasudeva",
  name: "vasudeva",
  hue: 12,
  arcEntry: {
    sections: [],
  },
};
