import { getSentiment } from "../src/client/js/formHandler";

// The describe() function takes two arguments - a string description, and a test suite as a callback function.
// A test suite may contain one or more related tests
describe("Testing the submit functionality", () => {
  // The test() function has two arguments - a string description, and an actual test as a callback function.
  test("Testing the getSentiment() function", () => {
    // Define the input for the function, if any, in the form of variables/array
    let expectedValue = "positive";
    let response = { sentiment: "positive" };
    let result = getSentiment(response);
    expect(result).toEqual(expectedValue);
  });
});
