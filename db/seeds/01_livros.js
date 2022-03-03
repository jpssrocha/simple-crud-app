/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
const fs = require('fs');
const { join } = require('path');
const { parse } = require('csv-parse/sync');

const fileContent = fs.readFileSync(join(__dirname, 'bd_livraria-livros-serialized.csv'));
const data = parse(fileContent, {columns: true});

exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('livros').del();
  await knex('livros').insert(data);
  await knex.raw(`SELECT setval('livros_id_seq', (SELECT MAX(id) FROM livros)+1);`);

};
