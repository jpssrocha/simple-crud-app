/*
 * Isolating database connection stuff.
 *
 */

const knex = require("knex");
const knexFile = require("./knexfile");

const knexConf = knexFile[process.env.NODE_ENV || "development"];
const db = knex(knexConf);

module.exports = db;
