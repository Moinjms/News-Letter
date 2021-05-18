const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");
const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({
  extended: true
}));
app.get("/", function(req, res) {
  res.sendFile(__dirname + "/signup.html")
});

app.post("/", function(req, res) {
  const getName = req.body.fName;
  const email = req.body.eMail;
  const data = {
    members: [{
      email_address: email,
      status: "subscribed",
      merge_fields: {
        FNAME: getName,
        LNAME: getName
      }
    }]
  };
  if (getName.trim() === "" || email.trim() === "") {
      res.sendFile(__dirname + "/valid.html");
  };
  const jsonData = JSON.stringify(data);
  // const url = "https://${dc}.api.mailchimp.com/3.0/ping"
  const url = "https://us1.api.mailchimp.com/3.0/lists/e043fcfd50";

  const options = {
    method: "POST",
    auth: "moin:0a0eb8e9b861f7aed2a0a95ad746a190-us1"
  }
  const request = https.request(url, options, function(response) {
    // console.log(response.statusCode);
    if (response.statusCode === 200) {
      res.sendFile(__dirname + "/success.html");
    } else {
      res.sendFile(__dirname + "/failure.html");
    };
    response.on("data", function(data) {
      //console.log(JSON.parse(data));
    })
  });
  request.write(jsonData);
  request.end();
});

app.post("/failure", function(req, res) {
  res.redirect("/");
});

app.post("/success", function(req, res) {
  res.redirect("/");
});

app.post("/valid", function(req, res) {
  res.redirect("/");
});

app.listen(process.env.PORT || 3000, function() {
  console.log("Server Started...3000 local or other defined");
});
//api key
//0a0eb8e9b861f7aed2a0a95ad746a190-us1
//e043fcfd50
