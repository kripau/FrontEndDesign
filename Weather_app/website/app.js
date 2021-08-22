/* Global Variables */

let baseURL = "https://api.openweathermap.org/data/2.5/weather?zip=";
const key = "ef30ce06d1082250747207225428ed06";

// Create a new date instance dynamically with JS
const date = new Date();
let newDate = new Intl.DateTimeFormat("en-GB", { dateStyle: "full" }).format(
  date
);

document.getElementById("generate").addEventListener("click", performAction);

function performAction(e) {
  const zipCode = document.getElementById("zip").value;
  const feelings = document.getElementById("feelings").value;
  getTemperature(baseURL, zipCode, key).then(function (data) {
    // Add data to POST request
    postData("http://localhost:8000/addWeatherData", {
      temperature: tempKelvinToCelsius(data.main.temp),
      date: newDate,
      user_response: feelings,
    })
      // Function which updates UI
      .then(function () {
        updateUI();
      });
  });
}

// Async GET
const getTemperature = async (baseURL, code, key) => {
  const response = await fetch(baseURL + code + ",us" + "&APPID=" + key);
  try {
    const data = await response.json();
    return data;
  } catch (error) {
    console.log("error", error);
  }
};

// Async POST
const postData = async (url = "", data = {}) => {
  const postRequest = await fetch(url, {
    method: "POST",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  try {
    // console.log('Post data function?');
    let newData = await postRequest.json();
    return newData;
  } catch (error) {
    console.log("Error", error);
  }
};

// Update user interface
const updateUI = async () => {
  const serverResponse = await fetch("http://localhost:8000/all");
  try {
    const allData = await serverResponse.json();
    document.getElementById("date").innerHTML = allData.date;
    document.getElementById("temp").innerHTML = allData.temperature;
    document.getElementById("content").innerHTML = allData.user_response;
  } catch (error) {
    console.log("error", error);
  }
};

// helper function to convert temp from Kelvin to Celsius
function tempKelvinToCelsius(K) {
  if (K < 0) {
    return "below absolute zero (0 K)";
  } else {
    return (K - 273.15).toFixed(2) + " C";
  }
}
