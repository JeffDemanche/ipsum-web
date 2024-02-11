export default function addEmptyRatedHighlights(data: any) {
  const daysCopy = { ...data.days };

  Object.values(daysCopy).forEach((day: any) => {
    if (!day.ratedHighlights) {
      day.ratedHighlights = [];
      console.log(`Added empty ratedHighlights to day ${day.day}`);
    }
  });

  data.days = daysCopy;
}
