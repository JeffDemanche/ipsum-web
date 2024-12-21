import {
  dataToSearchParams,
  EMPTY_ARRAY,
  EMPTY_OBJECT,
  urlToData,
} from "../urls";

describe("url", () => {
  describe("dataToSearchParams", () => {
    test("should encode an empty array with semaphore", () => {
      expect(dataToSearchParams({ a: [{ b: [] }] })).toEqual(
        `a[0][b]=${EMPTY_ARRAY}`
      );
    });

    test("should encode an empty object with semaphore", () => {
      expect(dataToSearchParams({ a: { b: {} } })).toEqual(
        `a[b]=${EMPTY_OBJECT}`
      );
    });
  });

  describe("urlToData", () => {
    test("should decode an empty array with semaphore", () => {
      expect(urlToData(`http://localhost?a[0][b]=${EMPTY_ARRAY}`)).toEqual({
        a: [{ b: [] }],
      });
    });

    test("should decode an empty object with semaphore", () => {
      expect(urlToData(`http://localhost?a[b]=${EMPTY_OBJECT}`)).toEqual({
        a: { b: {} },
      });
    });
  });
});
