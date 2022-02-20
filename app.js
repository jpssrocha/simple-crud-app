const express = require('express');
const app = express(); // Express boilerplate

const sqlite = require("sqlite3");
let db = new sqlite.Database("./bd_livraria.db");

const PORT = 3000;

app.set("engine ejs", "ejs"); // Setting up node app to use ejs pages over html

// Middleware
app.use(express.urlencoded({extended: false})); // To get form data from req.body

app.listen(PORT, () => {
    console.log(`Server running on: http://localhost:${PORT}`);
});

// "/" route -> GET a general view of the database registers
app.get("/", (req, res) => {

    const SQL = "SELECT * FROM livros ORDER BY id DESC;";

    db.all(SQL, [], (err, rows) => {
        // If the callback function returns some error it show it on the log.
        if (err) {
            console.error(err.message);
        }

        // To pass data to use with the EJS template we use the res.render
        // method. It kind of create a scope to use with the EJS scriptlets with
        // the passed JSON or collection

        res.render("index.ejs" , { data: rows });
    });
});

// "/about" route -> GET the about page (not using static as middleware cause it
// is the only static page ...)

app.get("/about", (req, res) => res.render("about.ejs"));

// "/insert_primary" route -> GET page with form for inserting new register on the
// master table (livros) and POST it to the database.

app.get("/insert_primary", (req, res) => {
    // Load form
    res.render("insert_primary.ejs");
});

app.post("/insert_primary", (req, res) => {

    // Define SQL query
    const SQL = "INSERT INTO livros (titulo, edicao, descricao, ideditora) VALUES (?, ? , ?, ?);";

    // Take arguments from the URL
    const {titulo, edicao, descricao, ideditora} = req.body;
    const values = [titulo, edicao, descricao, ideditora];

    db.run(SQL, values, (err) => {
        if (err) {
            console.error(err.msg)
        }
    });

    res.redirect("/")
});
