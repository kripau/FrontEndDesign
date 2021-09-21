document.getElementById("generate").addEventListener("click", performAction);

async function performAction(event) {
  event.preventDefault();
  const location = document.getElementById("loc").value;
  const depart_date = new Date(document.getElementById("depart").value);
  let departDate = new Intl.DateTimeFormat("en-GB", {
    dateStyle: "full",
  }).format(depart_date);
  const diffTime = Math.abs(depart_date - new Date());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  console.log(departDate);
  console.log(location);
  console.log(diffDays);
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
      document.getElementById("country").innerHTML =
        "Country : " + res.countryName;
    });
}

export { performAction };
