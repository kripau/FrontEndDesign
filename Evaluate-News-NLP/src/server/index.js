// var path = require('path')
const express = require('express')
const bodyParser = require('body-parser');
// const superagent = require('superagent');
const fetch = require('node-fetch');


const app = express()
const cors = require('cors');

app.use(express.static('dist'))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());


console.log(__dirname)


// designates what port the app will listen to for incoming requests
app.listen(8081, function () {
    console.log('Example app listening on port 8081!');
})

app.get('/', function (req, res) {
    console.log("inside server port 8081");
    res.sendFile('dist/index.html');
//     // res.sendFile(path.resolve('src/client/views/index.html'))
})

const meaningCloud = require('meaning-cloud');
const dotenv = require('dotenv');
dotenv.config();

async function callAPI(url){
      const apiKey = process.env.API_KEY;
      const meaingCloundURL = `https://api.meaningcloud.com/sentiment-2.1?key=${apiKey}&url=${url}&lang=en`;
      console.log(meaingCloundURL);

      const res = await fetch(meaingCloundURL);
      const data = await res.json() ;
      console.log(data)
    //   console.log(data.score_tag, data.agreement);
      return data;
}


// POST route
app.post("/sentiment", getSentiment);

function decodeSentiment(sentimentCode) {
    if (sentimentCode === 'P+') {
        return "STRONG POSITIVE";
    } else if (sentimentCode === "P") {
        return "POSITIVE";
    } else if (sentimentCode === "NEU") {
        return "NEUTRAL";
    } else if (sentimentCode === "N") {
        return "NEGATIVE";
    } else if (sentimentCode === "N+") {
        return "STRONG NEGATIVE";
    } else{
        return " WITHOUT POLARITY "
    }
}

async function getSentiment(request, response) {
        const url = request.body.url;
        console.log("i am in sever: url ", url);
        const data = await callAPI(url);
         let resposeData = {
            'sentiment': decodeSentiment(data.score_tag),
            'agreement': data.agreement,
            'subjectivity': data.subjectivity,
            'confidence': data.confidence,
            'irony': data.irony,
          };
        console.log("value to be return :", resposeData);
        response.send(resposeData);

}
