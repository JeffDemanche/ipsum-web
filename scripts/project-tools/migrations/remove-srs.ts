// remove srsCardReviews, srsCards, and srsDecks

// remove srsCardReviews from day objects

export default function removeSRS(data: any) {
  delete data.srsCardReviews;
  delete data.srsCards;
  delete data.srsDecks;

  Object.keys(data.days).forEach((key) => {
    console.log("Removing SRS card reviews from day", key);
    delete data.days[key].srsCardReviews;
  });
}
