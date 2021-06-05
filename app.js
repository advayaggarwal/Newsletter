const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const client = require("@mailchimp/mailchimp_marketing");
const https = require("https");
const dotenv = require("dotenv").config();

const app = express();

app.use(express.static("public"));

app.use(bodyParser.urlencoded({
    extended: true
}));

const myApiKey = process.env.API_KEY;

client.setConfig({
    apiKey: myApiKey,
    server: "us6",
});

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/signup.html");
});

app.post("/", function (req, res) {
    const firstName = req.body.fName;
    const lastName = req.body.lName;
    const email = req.body.email;

    const subscribingUser = {
        firstName: firstName,
        lastName: lastName,
        email: email
    }

    const run = async () => {
        try {
            const response = await client.lists.addListMember("e5e66d163f", {
                email_address: subscribingUser.email,
                status: "subscribed",
                merge_fields: {
                    FNAME: subscribingUser.firstName,
                    LNAME: subscribingUser.lastName
                }
            });
            console.log(response);
            res.sendFile(__dirname + "/success.html");
        } catch (error) {
            console.log(error);
            res.sendFile(__dirname + "/failure.html");
        }
    };

    run();
});

app.post("/failure", function (req, res) {
    res.redirect("/");
});

app.listen(process.env.PORT || 3000, function () {
    console.log("Server is running on port 3000");
});