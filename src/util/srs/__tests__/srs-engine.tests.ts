import { calculateNextInterval } from "../srs-engine";

const assertNextInterval = ({
  previousInterval,
  previousEF,
  rating,
  nextInterval,
  nextEF,
}: {
  previousInterval: number;
  previousEF: number;
  rating: number;
  nextInterval: number;
  nextEF: number;
}) => {
  const next = calculateNextInterval(previousInterval, previousEF, rating);
  expect(next.nextInterval).toBeCloseTo(nextInterval);
  expect(next.nextEF).toBeCloseTo(nextEF);
};

describe.skip("SRS Engine", () => {
  it.each`
    previousInterval | previousEF | rating | nextInterval | nextEF
    ${1}             | ${2.5}     | ${0}   | ${2.5}       | ${1.7}
    ${1}             | ${2.5}     | ${1}   | ${2.5}       | ${1.96}
    ${1}             | ${2.5}     | ${3}   | ${2.5}       | ${2.36}
    ${1}             | ${2.5}     | ${4}   | ${2.5}       | ${2.5}
    ${1}             | ${2.5}     | ${5}   | ${2.5}       | ${2.6}
  `(
    "first rating results (previousInterval: $previousInterval, previousEF: $previousEF, rating: $rating), (nextInterval: $nextInterval, nextEF: $nextEF)",
    assertNextInterval
  );

  it.each`
    previousInterval | previousEF | rating | nextInterval | nextEF
    ${2.5}           | ${1.7}     | ${0}   | ${4.25}      | ${0.9}
    ${1.53}          | ${0.9}     | ${0}   | ${1.38}      | ${0.5}
    ${1}             | ${0.5}     | ${0}   | ${1}         | ${0.5}
  `(
    "keep rating 0 results (previousInterval: $previousInterval, previousEF: $previousEF, rating: $rating), (nextInterval: $nextInterval, nextEF: $nextEF)",
    assertNextInterval
  );

  it.each`
    previousInterval | previousEF | rating | nextInterval | nextEF
    ${1}             | ${0.5}     | ${1}   | ${1}         | ${0.5}
    ${1}             | ${0.5}     | ${2}   | ${1}         | ${0.5}
    ${1}             | ${0.5}     | ${3}   | ${1}         | ${0.5}
    ${1}             | ${0.5}     | ${4}   | ${1}         | ${0.5}
    ${1}             | ${0.5}     | ${5}   | ${1}         | ${0.6}
    ${1}             | ${0.6}     | ${5}   | ${1}         | ${0.7}
    ${1}             | ${0.7}     | ${5}   | ${1}         | ${0.8}
  `(
    "results 'digging out' card (previousInterval: $previousInterval, previousEF: $previousEF, rating: $rating), (nextInterval: $nextInterval, nextEF: $nextEF)",
    assertNextInterval
  );
});
