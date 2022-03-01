/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
const fs = require('fs');
const { join } = require('path');
const { parse } = require('csv-parse/sync');

console.log(__dirname + '/bd_livraria-livros.csv')
const fileContent = fs.readFileSync(join(__dirname, 'bd_livraria-livros.csv'));
const data = parse(fileContent, {columns: true});

exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('livros').del()
  await knex('livros').insert(data);
};
