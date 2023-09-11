export const migrateSRS = (fileData: any) => {
  fileData["srsDecks"] = {
    default: {
      __typename: "SRSDeck",
      id: "default",
      cards: [],
    },
  };

  fileData["srsCards"] = {};
  fileData["srsCardReviews"] = {};
};
