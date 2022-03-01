const express = require("express");
const app = express(); // Express boilerplate
const methodOverride = require("method-override");
require("dotenv").config();

// Importing database
const db = require("./db/db");


const PORT = process.env.PORT || 3000;

app.set("engine ejs", "ejs"); // Setting up node app to use ejs pages over html

// Middleware
app.use(express.urlencoded({extended: false})); // To get form data from req.body
app.use(methodOverride("_method")); // To override POST from form into the proper method


// "/" route -> GET a general view of the database registers
app.get("/", async (req, res) => {

    try {

        // Setting query

        const SQL = `SELECT *
                     FROM livros
                     INNER JOIN publicacao
                     ON (livros.id = publicacao.livro_id)
                     ORDER BY id DESC;`;

        // Knex is a query builder, but it has the raw option, that i will use
        // since i'm learning SQL.

        const { rows } = await db.raw(SQL);

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
                           VALUES (?, ? , ?, ?)
                           RETURNING id;`;

        const { rows }= await db.raw(sqlMaster, valuesMaster);
        const { id } = rows[0];


        // Insert details on dependent table

        const sqlDetail = `INSERT INTO publicacao (ano_publicacao, nome_edicao, livro_id)
                            VALUES (?, ?, ?)`;
        const valuesDetail = [ano_publicacao, nome_edicao, id];

        await db.raw(sqlDetail, valuesDetail);

        res.status(201).redirect("/");
    }
    catch(error){
        console.error(error);
        res.send({error : error.message})
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

        const { rows }  = await db.raw(SQL, idMaster);
        const [ row ] = rows;

        // Pass to rendering page
        res.render("insert_detail.ejs", { row });
    }
    catch(error){
        console.error(error);
    }
});

app.post("/insert_detail/:idMaster", async (req, res) => {

    try {
        // Take take from the request
        const { idMaster } = req.params;
        const { ano_publicacao, nome_edicao } = req.body;

        // Insert row into
        const sqlDetail = `INSERT INTO publicacao (ano_publicacao, nome_edicao, livro_id)
        VALUES (?, ?, ?)`;
        const data = [ ano_publicacao, nome_edicao, idMaster ];

        await db.raw(sqlDetail, data);
        res.redirect("/");

    } catch(error){
        console.error(error.message);
    }
});

// "/edit" route -> GET page for editing then PUT modified version on the
// database.

app.get("/edit/:idMaster/:idDetail", async (req, res) => {

    // Get id
    const { idMaster, idDetail } = req.params;
    const ids = [ idMaster, idDetail ];

    // Recover info from this id combination
    const SQL = `SELECT *
                 FROM livros
                 INNER JOIN publicacao
                 ON (livros.id = publicacao.livro_id)
                 WHERE livros.id = ? and publicacao.id_pub = ?;`;

    const row = await db.get(SQL, ids).catch(err => console.error(err));

    res.render("edit.ejs", { row });
});


app.put("/edit/:idMaster/:idDetail", async (req, res) => {

    try{
        // Get parameters from URL
        const { idMaster, idDetail } = req.params;

        // Get data
        const { titulo, edicao, descricao, ideditora, ano_publicacao, nome_edicao } = req.body;

        // Apply UPDATE to master table
        const sqlMaster = "UPDATE livros SET titulo = ?, edicao = ?, descricao = ?, ideditora = ?  WHERE id = ?";
        const dataMaster = [ titulo, edicao, descricao, ideditora, idMaster ];
        const promiseMaster = db.run(sqlMaster, dataMaster);

        // Apply UPDATE to detail table
        const sqlDetail = "UPDATE publicacao SET ano_publicacao = ?, nome_edicao = ? WHERE id_pub = ?;";
        const dataDetail = [ ano_publicacao, nome_edicao, idDetail ];
        const promiseDetail = db.run(sqlDetail, dataDetail);

        // Resolve all promises
        await Promise.all([promiseDetail, promiseMaster]);

        res.redirect("/");
    }
    catch(err){
        console.error( err );
    }

});

// "/delete" route -> GET view of the register DELETE detail or DELETE all
// details along with masters

app.get("/delete/:idMaster/:idDetail", async (req, res) => {
    try{
        const { idMaster, idDetail} = req.params;

        // Fetch data from database
        const data = [ idMaster, idDetail ];
        const SQL = `SELECT *
                     FROM livros
                     JOIN publicacao
                     ON livros.id = publicacao.livro_id
                     WHERE livros.id = ? and publicacao.id_pub = ?`;
        const row = await db.get(SQL, data);

        res.render("delete.ejs", { row });
    }
    catch(error){
        console.error(error);
    }

});


app.delete("/delete_detail/:idMaster/:idDetail", async (req, res) => {
    try {
        const { idDetail } = req.params;

        const SQL = `DELETE
                     FROM publicacao
                     WHERE id_pub = ?`;

        await db.run(SQL, idDetail);

        res.redirect("/");
    }
    catch(error){
        console.error(error);
    }

});


app.delete("/delete_all/:idMaster", async (req, res) => {
    try {
        const { idMaster } = req.params;

        // Fetch data from database
        const SQL = `DELETE
                     FROM publicacao
                     WHERE livro_id = ?`;

        await db.run(SQL, idMaster);

        res.redirect("/");
    }
    catch(error){
        console.error(error);
    }

});


app.listen(PORT, () => {
    console.log(`Server running on: http://localhost:${PORT}`);
});
