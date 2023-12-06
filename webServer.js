const body_parser = require("body-parser"),
      express = require('express'),
      path = require('path');

const app = express();
    //   , DOMAIN = "localhost:5000";


/* Sets destination of where the templates are and specifies which type of engine we'll use */
app.set("views", path.resolve(__dirname, "./templates"));
app.set("view engine", "ejs");

 /* Use this middleware to read POST body */
 app.use(body_parser.urlencoded({extended: false}))

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

app.get("/join/private", (req, res) => {

    let sessionID = req.query.sessionID;

    /* TODO: retrieve the session with this ID from the database */

    res.render("session");
});

app.get("/create", (req, res) => {

    res.render("createConfig");
});

app.post("/create/done", (req, res) => {

    console.log(req.body)

    /* TODO: here, extract the actual content of the POST request and store it in DB */

    res.render("sessions");
});

app.listen(5000);

console.log("Web server listening on port: 5000")