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
    res.sendFile(path.join(__dirname, "/Develop/public/assets/css/styles.css"));
    res.sendFile(path.join(__dirname, "/Develop/public/assets/js/index.js"));
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
    let newNote = req.body;

    const writeMyFile = (body) => {
        fs.writeFile("./Develop/db/db.json", body, err => {
            if (err) throw err;
            return res.json(body);
        });
    }
    fs.exists("./Develop/db/db.json", exists => {
        if (exists) {
            fs.readFile("./Develop/db/db.json", "utf8", (err, data) => {
                if (err) throw err;
                console.log(data);

                let notes = JSON.parse(data);
                notes.push(newNote);
                writeMyFile(JSON.stringify(notes));
            })
        } else {
            writeMyFile((`[${JSON.stringify(newNote)}]`));
        }
    })

});
app.delete("/api/notes/:id", function (req, res) {
    res.sendFile(path.join(__dirname, "view.html"));
});

// Starts the server to begin listening
app.listen(PORT, function () {
    console.log("App listening on PORT " + PORT);
});