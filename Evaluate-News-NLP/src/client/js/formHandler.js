// set global variables
const error = document.getElementById("error");
const urlX = document.getElementById("current_url");
const sentiment = document.getElementById("sentiment");
const agreement = document.getElementById("agreement");
const subjectivity = document.getElementById("subjectivity");
const confidence = document.getElementById("confidence");
const irony = document.getElementById("irony");

export async function handleSubmit(event) {
  event.preventDefault();
  let news_url = document.getElementById("url").value;
  //clears user input
  sentiment.innerHTML = "";
  agreement.innerHTML = "";
  subjectivity.innerHTML = "";
  confidence.innerHTML = "";
  irony.innerHTML = "";
  document.getElementById("url").value = "";
  console.log("url is :", news_url);
  // check what text was put into the form field
  if (Client.checkForUrl(news_url)) {
    console.log("::: Form Submitted 1234 :::");
    urlX.innerHTML = "Current URL:  " + news_url;

    await fetch("http://localhost:8081/sentiment", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url: news_url }),
    })
      .then((res) => res.json())
      .then((res) => {
        error.innerHTML = "";
        sentiment.innerHTML = "Sentiment:  " + getSentiment(res);
        agreement.innerHTML = "Agreement:  " + res.agreement;
        subjectivity.innerHTML = "Subjectivity:  " + res.subjectivity;
        confidence.innerHTML = "Confidence:  " + res.confidence;
        irony.innerHTML = "Irony:  " + res.irony;
      });
  } else {
    //error message
    urlX.innerHTML = "";
    error.innerHTML =
      "Invalid URL. Please make sure the URL starts with http:// or https:// and has no spaces.";
  }
}

export function getSentiment(res) {
  return res.sentiment;
}
