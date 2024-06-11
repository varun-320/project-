// Importing the required modules
const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');
const port = 3000;

// Store the database in /static/database.json
let db = JSON.parse(fs.readFileSync(path.join(__dirname, 'static', 'database.json')));

// Middleware to parse the request body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('static'));

// Rendering the index.html file
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, 'static', 'index.html'));
});

// Displaying the data in the database
app.get("/log", (req, res) => {
    db = JSON.parse(fs.readFileSync(path.join(__dirname, 'static', 'database.json')));
    res.json(db);
});

// Saving the data in the database
app.post("/savedata", (req, res) => {
    const { shortid, url } = req.body;
    if (!shortid || !url) {
        return res.status(400).send(`<body bgcolor="red"> Data Not Entered </body> <script>setTimeout(() => {window.location.href = "/";}, 2000);</script>`);
    }

    if (!/^[a-zA-Z0-9]+$/.test(shortid)) {
        return res.status(400).send(`<body bgcolor="red"> Shortid should be alphanumeric </body> <script>setTimeout(() => {window.location.href = "/";}, 2000);</script>`);
    }

    if (db[shortid]) {
        return res.status(400).send(`<body bgcolor="red"> Data Already Exists </body> <script>setTimeout(() => {window.location.href = "/";}, 2000);</script>`);
    }

    db[shortid] = url;
    fs.writeFileSync(path.join(__dirname, 'static', 'database.json'), JSON.stringify(db, null, 2));
    res.send(`<body bgcolor="green"> Data Entered Successfully </body> <script>setTimeout(() => {window.location.href = "/";}, 2000);</script>`);
});

// Updating data in the database
app.put("/updatedata", (req, res) => {
    const { shortid, url } = req.body;
    if (!shortid || !url) {
        return res.status(400).send(`<body bgcolor="red"> Data Not Entered </body> <script>setTimeout(() => {window.location.href = "/";}, 2000);</script>`);
    }

    if (!/^[a-zA-Z0-9]+$/.test(shortid)) {
        return res.status(400).send(`<body bgcolor="red"> Shortid should be alphanumeric </body> <script>setTimeout(() => {window.location.href = "/";}, 2000);</script>`);
    }

    if (!db[shortid]) {
        return res.status(404).send(`<body bgcolor="red"> Data Not Found </body> <script>setTimeout(() => {window.location.href = "/";}, 2000);</script>`);
    }

    db[shortid] = url;
    fs.writeFileSync(path.join(__dirname, 'static', 'database.json'), JSON.stringify(db, null, 2));
    res.send(`<body bgcolor="green"> Data Updated Successfully </body> <script>setTimeout(() => {window.location.href = "/";}, 2000);</script>`);
});

// Redirecting to the 404 page
app.get("/404", (req, res) => {
    res.sendFile(path.join(__dirname, 'static', '404.html'));
});

// Redirecting to the original url
app.get("/:shortid", (req, res) => {
    const shortid = req.params.shortid;
    const url = db[shortid];
    if (url) {
        res.redirect(url);
    } else {
        res.redirect("/404");
    }
});

// Listening to the port
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
