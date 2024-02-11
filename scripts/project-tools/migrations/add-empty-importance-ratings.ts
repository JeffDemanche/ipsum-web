export default function addEmptyImportanceRatings(data: any) {
  const highlightsCopy = { ...data.highlights };

  Object.values(highlightsCopy).forEach((highlight: any) => {
    if (!highlight.importanceRatings) {
      highlight.importanceRatings = [];
      console.log(`Added empty importanceRatings to highlight ${highlight.id}`);
    }
  });

  data.highlights = highlightsCopy;
}
