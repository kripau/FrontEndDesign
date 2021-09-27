// Note: as exposing the API key in the clint side code is not a good idea
// I have made the  third party API call from the server
// Because of that API key which is supposed to be private will not be
// exposed to the user

let gen = document.getElementById("generate");
if (gen) {
  gen.addEventListener("click", performAction);
}

async function performAction(event) {
  event.preventDefault();
  const location = document.getElementById("loc").value;
  const depart_date = new Date(document.getElementById("depart").value);
  const return_date = new Date(document.getElementById("return").value);
  const lengthOfTravel = Math.ceil(
    Math.abs(return_date - depart_date) / (1000 * 60 * 60 * 24)
  );
  let departDate = new Intl.DateTimeFormat("en-GB", {
    dateStyle: "full",
  }).format(depart_date);
  let returnDate = new Intl.DateTimeFormat("en-GB", {
    dateStyle: "full",
  }).format(return_date);
  console.log(departDate);
  console.log(returnDate);
  const diffTime = Math.abs(depart_date - new Date());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  await fetch("http://localhost:8000/travelData", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      location: location,
      depart_date: depart_date,
      diffDays: diffDays,
    }),
  })
    .then((res) => res.json())
    .then((res) => {
      document.getElementById("trip_info").hidden = false;
      document.getElementById("country_info").hidden = false;
      document.getElementById("res_trip").innerHTML =
        "My trip to " + location.toUpperCase() + ", " + res.countryName;
      document.getElementById("res_depart_date").innerHTML =
        "Departure date : " + departDate;
      document.getElementById("res_return_date").innerHTML =
        "Return date : " + returnDate;
      document.getElementById("length_stay").innerHTML =
        "Length of stay : " + lengthOfTravel + " days";

      document.getElementById("days_away").innerHTML =
        departDate + " is " + diffDays + " days away from the current date";
      if (diffDays > 0 && diffDays < 7) {
        document.getElementById("high_temp").hidden = true;
        document.getElementById("low_temp").hidden = true;
        document.getElementById("temp").innerHTML =
          "Normal temperature : " + res.normal_temp + " &deg;C";
      } else {
        document.getElementById("temp").hidden = true;
        document.getElementById("high_temp").innerHTML =
          "High temperature : " + res.high_temp + " &deg;C";
        document.getElementById("low_temp").innerHTML =
          "Low temperature : " + res.low_temp + " &deg;C";
      }
      document.getElementById("day_review").innerHTML =
        "Summary : " + res.description;
      document.getElementById("image_country").src = res.imageURL;
      document.getElementById("official").innerHTML =
        "Official name : " + res.officialName;
      document.getElementById("curr_code").innerHTML =
        "Currency code : " + res.currencyCode;
      document.getElementById("curr").innerHTML =
        "Currency : " + getCurrency(res);
      document.getElementById("capital").innerHTML = "Capital : " + res.capital;
      document.getElementById("region").innerHTML = "Region : " + res.region;
      document.getElementById("sub_region").innerHTML =
        "Sub region : " + res.subregion;
      document.getElementById("lang").innerHTML =
        "Language spoken : " + res.language;
      document.getElementById("flag_country").src = res.flag;
    });
}

export function getCurrency(res) {
  return res.currency;
}

export { performAction };
