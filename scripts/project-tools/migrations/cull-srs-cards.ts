export default function cullSRSCards(data: any) {
  const srsCardsCopy = { ...data.srsCards };

  Object.values(srsCardsCopy).forEach((card: any) => {
    if (card.subjectType === "Arc") {
      const arc = data.arcs[card.subject];
      if (!arc) {
        delete srsCardsCopy[card.id];
      }
    }
    if (card.subjectType === "Highlight") {
      const highlight = data.highlights[card.subject];
      if (!highlight) {
        delete srsCardsCopy[card.id];
      }
    }
  });

  data.srsCards = srsCardsCopy;
}
