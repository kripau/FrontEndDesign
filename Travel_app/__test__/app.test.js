import { getCurrency } from "../src/client/js/app";

// The describe() function takes two arguments - a string description, and a test suite as a callback function.
// A test suite may contain one or more related tests
describe("Testing the  functionality", () => {
  // The test() function has two arguments - a string description, and an actual test as a callback function.
  test("Testing the getCurrency() function", () => {
    // Define the input for the function, if any, in the form of variables/array
    let expectedValue = "Australian Dollar";
    let response = { currency: "Australian Dollar" };
    let result = getCurrency(response);
    expect(result).toEqual(expectedValue);
  });
});
