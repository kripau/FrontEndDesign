import { createGeoNamesURL } from "../src/server/app_util";

describe("Testing the  functionality", () => {
  test("Testing the createGeoNamesURL() function", () => {
    const expectedValue = `http://api.geonames.org/search?q=sydney&maxRows=1&type=json&username=saphal`;
    let username = "saphal";
    let location = "sydney";
    let result = createGeoNamesURL(location, username);
    expect(result).toEqual(expectedValue);
  });
});
