export default function comments(data: any) {
  const highlightsCopy = { ...data.highlights };

  Object.values(highlightsCopy).forEach((highlight: any) => {
    if (!highlight.comments) {
      highlight.comments = [];
    }
  });

  data.highlights = highlightsCopy;
}
