export default function addSrsAndProjectVersion(data: any) {
  data.projectVersion = "0.1";

  data.srsCards = {};

  Object.keys(data.days).forEach((dayKey) => {
    data.days[dayKey].srsCardsReviewed = [];
  });
  Object.keys(data.highlights).forEach((highlightKey) => {
    data.highlights[highlightKey].srsCard = undefined;
  });
}
