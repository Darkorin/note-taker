const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Routes
app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, "/Develop/public/index.html"));
});

app.get("/notes", function (req, res) {
    res.sendFile(path.join(__dirname, "/Develop/public/notes.html"));
});


// API Routes
app.get("/api/notes", function (req, res) {
    fs.readFile("./Develop/db/db.json", "utf8", (err, data) => {
        if (err) throw err;
        console.log(data);
        return res.json(data);
    });
});

app.post("/api/notes", function (req, res) {
    res.sendFile(path.join(__dirname, "view.html"));
});
app.delete("/api/notes/:id", function (req, res) {
    res.sendFile(path.join(__dirname, "view.html"));
});

// Starts the server to begin listening
app.listen(PORT, function () {
    console.log("App listening on PORT " + PORT);
});