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
      temperature: data.main.temp,
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
  let dropdownSelection = document.getElementById("dropdownContent").value;
  let urlUnitComponent = "";
  if (dropdownSelection === "Celsius") {
    urlUnitComponent = "&units=metric";
  } else if (dropdownSelection === "Fahrenheit") {
    urlUnitComponent = "&units=imperial";
  } else {
    urlUnitComponent = "&units=standard";
  }
  let requestURL = baseURL + code + ",us" + "&APPID=" + key + urlUnitComponent;
  console.log("request url ", requestURL);
  const response = await fetch(requestURL);
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
    let newData = await postRequest.json();
    console.log(newData);
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

    let dropdownSelection = document.getElementById("dropdownContent").value;
    let tempUnit = "";
    if (dropdownSelection === "Celsius") {
      tempUnit = " &deg;C";
    } else if (dropdownSelection === "Fahrenheit") {
      tempUnit = " &deg;F";
    } else {
      tempUnit = " &deg;K";
    }
    document.getElementById("date").innerHTML = allData.date;
    document.getElementById("temp").innerHTML = allData.temperature + tempUnit;
    document.getElementById("content").innerHTML = allData.user_response;
  } catch (error) {
    console.log("error", error);
  }
};
