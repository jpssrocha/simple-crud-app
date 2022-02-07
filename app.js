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
