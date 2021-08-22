// Setup empty JS object to act as endpoint for all routes
projectData = {};

// Require Express to run server and routes
const express = require("express");
const bodyParser = require("body-parser");

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
app.use(express.static("website"));

// Setup Server
const port = 8000;
const server = app.listen(port, () => {
  console.log(`running on localhost: ${port}`);
});

//GET route
app.get("/all", getData);

// POST route
app.post("/addWeatherData", postAddWetherData);

function getData(request, response) {
  response.send(projectData);
}

function postAddWetherData(request, response) {
  projectData.temperature = request.body.temperature;
  projectData.date = request.body.date;
  projectData.user_response = request.body.user_response;
  response.json(projectData);
}
