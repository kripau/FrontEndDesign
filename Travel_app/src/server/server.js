// Setup empty JS object to act as endpoint for all routes
const dotenv = require("dotenv");
dotenv.config();

// Require Express to run server and routes
const express = require("express");
const bodyParser = require("body-parser");
const fetch = require("node-fetch");
const util = require("./app_util.js");

// Start up an instance of app
const app = express();

/* Middleware*/
//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Cors for cross origin allowance
const cors = require("cors");
app.use(cors());

// Initialize the main project folder
app.use(express.static("dist"));

// Setup Server
const port = 8000;
const server = app.listen(port, () => {
  console.log(`running on localhost: ${port}`);
});

//url endpoint mapping
app.post("/travelData", postTravelData);

async function postTravelData(request, response) {
  const location = request.body.location;
  const depart_date = request.body.depart_date;
  const diffDays = request.body.diffDays;
  let futureWeather = diffDays < 15 ? diffDays : 15;
  let data_geo = await geonamesApi(location);
  const lat = data_geo.geonames[0].lat;
  const lng = data_geo.geonames[0].lng;
  const countryName = data_geo.geonames[0].countryName;

  let data_weatherbit = await WeatherbitApi(lat, lng, diffDays);
  let high_temp = "";
  let low_temp = "";
  let temp = "";
  let description = "";

  if (diffDays <= 7 && diffDays > 0) {
    high_temp = data_weatherbit.data[0].high_temp;
    low_temp = data_weatherbit.data[0].low_temp;
    temp = data_weatherbit.data[0].temp;
    description = data_weatherbit.data[0].weather.description;
  } else if (diffDays > 7) {
    high_temp = data_weatherbit.data[futureWeather].high_temp;
    low_temp = data_weatherbit.data[futureWeather].low_temp;
    temp = data_weatherbit.data[futureWeather].temp;
    description = data_weatherbit.data[futureWeather].weather.description;
  }
  let data_pixabay = await pixabayApi(location);
  const imageURL = data_pixabay.hits[0].webformatURL;

  let data_rest = await restcountriesAPI(countryName);
  const officialName = data_rest[0].name.official;
  const currencyCode = Object.keys(data_rest[0].currencies)[0];
  const currencyName = data_rest[0].currencies[currencyCode].name;
  const capital = data_rest[0].capital[0];
  const region = data_rest[0].region;
  const subregion = data_rest[0].subregion;
  const languageCode = Object.keys(data_rest[0].languages)[0];
  const language = data_rest[0].languages[languageCode];
  const flag = data_rest[0].flags[1];
  let resposeData = {
    countryName: countryName,
    high_temp: high_temp,
    low_temp: low_temp,
    normal_temp: temp,
    description: description,
    imageURL: imageURL,
    officialName: officialName,
    currencyCode: currencyCode,
    currency: currencyName,
    capital: capital,
    region: region,
    subregion: subregion,
    language: language,
    flag: flag,
  };
  console.log("value to be return :", resposeData);
  response.send(resposeData);
}

// calling geonamesApi to get geolocation
async function geonamesApi(location) {
  const username = process.env.API_geonames;
  const geonamesURL = util.createGeoNamesURL(location, username);
  data = await fetch(geonamesURL).then((res) => res.json());
  return data;
}

// calling WeatherbitApi to get weather data from weatherbit api
async function WeatherbitApi(lat, lng, diffDays) {
  let baseUrl = "";
  if (diffDays <= 7 && diffDays > 0) {
    baseUrl = "https://api.weatherbit.io/v2.0/current";
  } else if (diffDays > 7) {
    baseUrl = "https://api.weatherbit.io/v2.0/forecast/daily";
  } else {
    console.log("Error");
  }
  const API_key = process.env.API_weatherbit;
  console.log("from env file", process.env.API_weatherbit);
  const WeatherbitURL = `${baseUrl}?lat=${lat}&lon=${lng}&key=${API_key}`;
  data = await fetch(WeatherbitURL).then((res) => res.json());
  return data;
}

// calling pixabayApi to get  photo of city
async function pixabayApi(location) {
  const baseUrl = "https://pixabay.com/api/";
  const API_pixabay = process.env.API_pix;
  console.log("from env file", process.env.API_pix);

  const pixabayURL = `${baseUrl}//?key=${API_pixabay}&category=place&q=${location}&image_type=photo}`;
  data = await fetch(pixabayURL).then((res) => res.json());
  return data;
}

// calling restcountriesAPI to get  data of the country
async function restcountriesAPI(country) {
  const baseUrl = "https://restcountries.com";
  const restcountriesURL = `${baseUrl}/v3/name/${country}`;
  data = await fetch(restcountriesURL).then((res) => res.json());
  return data;
}
