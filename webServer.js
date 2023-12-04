const express = require('express'),
      path = require('path');

const app = express();
    //   , DOMAIN = "localhost:5000";




/* Sets destination of where the templates are and specifies which type of engine we'll use */
app.set("views", path.resolve(__dirname, "./templates"));
app.set("view engine", "ejs");

/* This endpoint handles all of the css GET requests */
app.get('/assets/:stylesheet', (req, res) => {

    /* Gets the the desired css file name from the request parameter */
    let css_file = (req.params).stylesheet;
    res.sendFile(path.resolve(__dirname, `./assets/${css_file}`));
});

app.get("/", (req, res) => {

    res.render("index");
});

app.get("/join", (req, res) => {

    res.render("joinPage");
});

app.get("/create", (req, res) => {

    res.render("sessions");
});

app.listen(5000);

console.log("Web server listening on port: 5000")