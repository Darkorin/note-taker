const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "/Develop/public/")))

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
    fs.readFile("./Develop/db/db.json", "utf8", (err, data) => {
        if (err) throw err;
        let notes = JSON.parse(data);
        console.log("BEFORE: " + JSON.stringify(notes));
        notes.forEach(note => {
            console.log(`ID COMPARE: note = ${note.id}  |  param = ${req.params.id}`)
            if (note.id == req.params.id) {
                console.log(`pre-splice${JSON.stringify(notes)}`);
                notes.splice(notes.indexOf(note), 1);
                console.log(`post-splice${JSON.stringify(notes)}`);
            }
        });
        console.log("AFTER: " + JSON.stringify(notes));
        fs.writeFile("./Develop/db/db.json", JSON.stringify(notes), err => {
            if (err) throw err;
            return res.send("Delete request processed");
        });
    })
});

// Starts the server to begin listening
app.listen(PORT, function () {
    console.log("App listening on PORT " + PORT);
});