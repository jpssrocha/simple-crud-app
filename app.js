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


// "/" route -> GET a general view of the database registers
app.get("/", async (req, res) => {

    try {

        const SQL = `SELECT *
                     FROM livros
                     INNER JOIN publicacao
                     ON (livros.id = publicacao.livro_id)
                     ORDER BY id DESC;`;

        const rows = await db.all(SQL);

        // To pass data to use with the EJS template we use the res.render
        // method. It kind of create a scope to use with the EJS scriptlets with
        // the passed JSON or collection

        res.render("index.ejs" , { data: rows });

    }
    catch(error){
        console.log(error);
    }


});

// "/about" route -> GET the about page (not using static as middleware cause it
// is the only static page ...)

app.get("/about", (req, res) => res.render("about.ejs"));

// "/insert_primary" route -> GET page with form for inserting new register on the
// master table (livros) and POST it to the database.

app.get("/insert_primary", (req, res) => res.render("insert_primary.ejs"));


app.post("/insert_primary", async (req, res) => {

    try {
    // Insert data into master
    //  Take arguments from the URL
    const {titulo, edicao, descricao, ideditora, ano_publicacao, nome_edicao} = req.body;
    const valuesMaster = [titulo, edicao, descricao, ideditora];
    const sqlMaster = `INSERT INTO livros (titulo, edicao, descricao, ideditora)
                        VALUES (?, ? , ?, ?);`;

    const { lastID } = await db.run(sqlMaster, valuesMaster);

    // Insert details on dependent table

    const sqlDetail = `INSERT INTO publicacao (ano_publicacao, nome_edicao, livro_id)
                        VALUES (?, ?, ?)`
    const valuesDetail = [ano_publicacao, nome_edicao, lastID]

    await db.run(sqlDetail, valuesDetail)

    res.redirect("/");
    }
    catch(error){
        console.error(error.message);
    }

});

// "/insert_detail" route -> GET page for inserting detail and POST new detail.

app.get("/insert_detail/:idMaster", async (req, res) => {

    try {
        // Recover detais from Master register
        const { idMaster } = req.params;

        const SQL = `SELECT *
                     FROM livros
                     INNER JOIN publicacao
                     ON (livros.id = publicacao.livro_id)
                     WHERE livros.id = ?;`;

        const row = await db.get(SQL, idMaster);

        // Pass to rendering page
        res.render("insert_detail.ejs", { row });
    }
    catch(error){
        console.error(error);
    }
});

app.post("/insert_detail/:idMaster", async (req, res) => {
    // Take take from the request
    const { idMaster } = req.params;
    const { ano_publicacao, nome_edicao } = req.body;

    // Insert row into
    const sqlDetail = `INSERT INTO publicacao (ano_publicacao, nome_edicao, livro_id)
                       VALUES (?, ?, ?)`;
    const data = [ ano_publicacao, nome_edicao, idMaster ];
    console.log(data);

    await db.run(sqlDetail, data).catch(error => console.error(error.message));

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
