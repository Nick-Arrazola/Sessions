const { MongoClient, ServerApiVersion, UUID } = require('mongodb'),
      body_parser = require("body-parser"),
      express = require('express'),
      path = require('path'),
      uuid = require('uuid');
const { type } = require('os');



require("dotenv").config({path: path.resolve(__dirname, './assets/.env')})
/* Extracts these environment variables from the process */
const name = (process.env).MONGO_USERNAME,
      password = (process.env).MONGO_PASSWORD,
      database_name = (process.env).DATABASE,
      database_collection = (process.env).COLLECTION;

const uri = `mongodb+srv://${name}:${password}@projects.y9tuif0.mongodb.net/?retryWrites=true&w=majority`,
      client = new MongoClient(uri, {
        serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true,
        }});

async function connectDBThenStartServer() {

    /* Creates the object that represents the server */
    const app = express();
    //   , DOMAIN = "localhost:5000";

    /* We'll wait for connection to DB. This is because we want
     * to connect to the DB before we setup and start the server */
    await client.connect();

    const sessions_db = client.db(database_name).collection(database_collection);

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

    /* This endpoint handles the GET request made when wanting to retrieve the join page */
    app.get("/join", (req, res) => {

        res.render("joinPage");
    });

    /* This endpoint handles the GET request made when client filtered using tags */
    app.get("/join/public", async (req, res) => {

            /* Three possible values for 'genre_q_args': 
             *
             *         UNDEFINED if no query arguments were sent ('.query' points to empty object),
             *         STRING if 1 query argument was sent (genresTag='rap')
             *         OBJECT if more than 1 query argument with the same key (genresTag=['rap', 'pop', 'rnb'])
             */
        let genre_q_args = (req.query).genreTags, 
            filter = { visibility: "public" }, cursor, all_public_sessions;

        if (typeof genre_q_args === "string") { filter = { ...filter, genre: genre_q_args}; }
        else if (typeof genre_q_args === "object") { filter = { ...filter, genre: {$in: genre_q_args} }; }
    
        cursor = await sessions_db.find(filter);
        all_public_sessions = await cursor.toArray();

        res.json(all_public_sessions);
    });

    app.get("/join/private", async (req, res) => {

        let sessionID = req.query.sessionID;

        /* TODO: retrieve the session with this ID from the database */

        res.redirect("/session");
    });

    app.get("/create", (req, res) => {

        res.render("createConfig");
    });

    app.get("/session", (req, res) => {

        res.render("sessions.ejs")
    });

    app.post("/create/done", async (req, res) => {

        /* Just realized that mongoDB already creates an ID for your
         * object by default, should I even use the UUID library then */

        /* Creates a random, yet unique ID */
        const session_id = uuid.v4();

        /* TODO: sanitize user input */
        let sess = { ...(req.body), sessionID: session_id };

        /* Insert session created into database */
        await sessions_db.insertOne(sess);

        /* Will perform a GET request to this endpoint (I think) as if the clients made it */
        res.redirect("/session");
    });

    console.log("Web server listening on port: 5000")

    /* This function call will actually start the server/ program that's infinitely running.
     * The 'listen' method itself is probably the one that is running forever */
    app.listen(5000);
}

connectDBThenStartServer();