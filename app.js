const express = require('express');
const app = express(); // Express boilerplate

const sqlite = require("sqlite3");
const db = new sqlite.Database("./bd_livraria.db");

const PORT = 3000;

app.set('engine ejs', 'ejs'); // Setting up node app to use ejs pages over html

// Middleware
app.use(express.urlencoded({extended: false})); // Get parameters from url

app.listen(PORT, () => {
    console.log('Server running on: http://localhost:3000');
});

// (/) -> Get a general view of the database registers
app.get('/', (req, res) => {

    var SQL = "SELECT * FROM livros ORDER BY id DESC;";

    db.all(SQL, [], (err, rows) => {
        // If the callback function returns some error it show it on the log.
        if (err) {
            console.error(err.message);
        }

        // To pass data to use with the EJS we use the res.render method it kind
         // of create a scope to use with the EJS scriptlets with the passed
         // JSON or collection

        res.render("index.ejs" , { data: rows });
    });
});
