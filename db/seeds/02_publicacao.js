/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
const fs = require('fs');
const { parse } = require('csv-parse/sync');

const fileContent = fs.readFileSync(__dirname + '/bd_livraria-publicacao-serialized.csv');
const data = parse(fileContent, {columns: true});

exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('publicacao').del()
  await knex('publicacao').insert(data);
  await knex.raw(`SELECT setval('publicacao_id_pub_seq', (SELECT MAX(livro_id) FROM publicacao)+1);`);
};
