function createGeoNamesURL(location, username) {
  const baseUrl = "http://api.geonames.org";
  return `${baseUrl}/search?q=${location}&maxRows=1&type=json&username=${username}`;
}

module.exports = { createGeoNamesURL };
