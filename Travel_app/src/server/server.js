// Setup empty JS object to act as endpoint for all routes
projectData = {};

// Require Express to run server and routes
const express = require("express");
const bodyParser = require("body-parser");
const fetch = require("node-fetch");

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

app.post("/travelData", postTravelData);

async function postTravelData(request, response) {
  const location = request.body.location;
  const depart_date = request.body.depart_date;
  const diffDays = request.body.diffDays;
  let futureWeather = diffDays < 15 ? diffDays : 15;
  // console.log("I am in server: depart_date", depart_date);
  // console.log("I am in server: diffDays", diffDays);
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
    //  return baseUrl
  } else if (diffDays > 7) {
    high_temp = data_weatherbit.data[futureWeather].high_temp;
    low_temp = data_weatherbit.data[futureWeather].low_temp;
    temp = data_weatherbit.data[futureWeather].temp;
    description = data_weatherbit.data[futureWeather].weather.description;
  }
  let data_pixabay = await pixabayApi(location);
  const imageURL = data_pixabay.hits[0].webformatURL;
  // console.log(imageURL)
  // console.log (lat);
  // console.log (lng);
  // console.log (countryName);
  // console.log (high_temp);
  // console.log (low_temp);
  // console.log (temp);
  // console.log (description);
  let resposeData = {
    countryName: countryName,
    high_temp: high_temp,
    low_temp: low_temp,
    normal_temp: temp,
    description: description,
    imageURL: imageURL,
  };
  console.log("value to be return :", resposeData);
  response.send(resposeData);
}

// function geoNamesApi(request)
async function geonamesApi(location) {
  const baseUrl = "http://api.geonames.org";
  const username = "kripaupretis"; // process.env.API_geonames;
  console.log("from env file", process.env.API_geonames); // TODO: need to fix

  const geonamesURL = `${baseUrl}/search?q=${location}&maxRows=1&type=json&username=${username}`;
  // console.log(geonamesURL);
  data = await fetch(geonamesURL).then((res) => res.json());
  // console.log(data);
  return data;
}

async function WeatherbitApi(lat, lng, diffDays) {
  let baseUrl = "";
  if (diffDays <= 7 && diffDays > 0) {
    baseUrl = "https://api.weatherbit.io/v2.0/current";
    // console.log("I am inside current")
    //  return baseUrl
  } else if (diffDays > 7) {
    baseUrl = "https://api.weatherbit.io/v2.0/forecast/daily";
    // console.log("I am inside future")

    //  return baseUrl
  } else {
    console.log("Error");
  }
  // console.log("baseURL" + baseUrl);
  const API_key = "bdb09874a4a945af844d36fb808285a7";
  // process.env.API_geonames;
  console.log("from env file", process.env.API_weatherbit); // TODO: need to fix

  const WeatherbitURL = `${baseUrl}?lat=${lat}&lon=${lng}&key=${API_key}`;
  // console.log(WeatherbitURL);
  data = await fetch(WeatherbitURL).then((res) => res.json());
  // console.log(data);
  return data;
}

// function pixabayApi(request)
async function pixabayApi(location) {
  const baseUrl = "https://pixabay.com/api/";
  const API_pixabay = "22446826-ca79efd142210a603f0eb7331"; // process.env.API_geonames;
  console.log("from env file", process.env.API_geonames); // TODO: need to fix

  const pixabayURL = `${baseUrl}//?key=${API_pixabay}&category=place&q=${location}&image_type=photo}`;
  // console.log(pixabayURL);
  data = await fetch(pixabayURL).then((res) => res.json());
  // console.log(data);
  return data;
}
