import { checkForUrl } from "../src/client/js/urlChecker";

// The describe() function takes two arguments - a string description, and a test suite as a callback function.
// A test suite may contain one or more related tests
describe("Testing the submit functionality", () => {
  // The test() function has two arguments - a string description, and an actual test as a callback function.
  test("Testing the checkForUrl() function", () => {
    // Define the input for the function, if any, in the form of variables/array
    let result = checkForUrl("https://www.bbc.com/news.html");
    expect(result).toEqual(true);
    result = checkForUrl("not a url");
    expect(result).toEqual(false);
  });
});
