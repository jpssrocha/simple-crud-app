const express = require("express");
const app = express(); // Express boilerplate
const methodOverride = require("method-override");

// Setting database up
const sqlite3 = require("sqlite3"); 
const { open } = require("sqlite");

dbPromise = open({
      filename: "bd_livraria.db",
      driver: sqlite3.Database
});

const PORT = 3000;

app.set("engine ejs", "ejs"); // Setting up node app to use ejs pages over html

// Middleware
app.use(express.urlencoded({extended: false})); // To get form data from req.body
app.use(methodOverride("_method")); // To override POST from form into the proper method

app.listen(PORT, () => {
    console.log(`Server running on: http://localhost:${PORT}`);
});

// "/" route -> GET a general view of the database registers
app.get("/", (req, res) => {

    const SQL = `SELECT * 
                 FROM livros 
                 INNER JOIN publicacao 
                 ON (livros.id = publicacao.livro_id) 
                 ORDER BY id DESC;`;

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
            return console.error(err.msg);
        }
    });

    res.redirect("/");
});

// "/edit" route -> GET page for editing then PUT modified version on the
// database.

app.get("/edit/:id", (req, res) => {

    // Get id
    const { id } = req.params;

    // Recover info from this id
    const SQL = "SELECT * FROM livros WHERE id=?";

    db.get(SQL, id, (err, row) => {
        if (err){
            return console.error(err.message)
        }

        // Render page with the id info
        res.render("edit.ejs", { row: row })
    });
});


app.put("/edit/:id", (req, res) => {

    // Get parameters
    const { titulo, edicao, descricao, ideditora } = req.body;
    const { id } = req.params;

    // Recover info from this id
    const data = [ titulo, edicao, descricao, ideditora, id ];
    const SQL = "UPDATE livros SET titulo = ?, edicao = ?, descricao = ?, ideditora = ?  WHERE id = ?";

    // Run query
    db.run(SQL, data, (err) => {
        if (err){
            console.error(err.message);
        }
        
        res.redirect("/");
    });
});

// Running code!
main = async () => {

    // open the database
    db = await dbPromise;

    app.listen(PORT, () => {
        console.log(`Server running on: http://localhost:${PORT}`);
    });
};


main();
