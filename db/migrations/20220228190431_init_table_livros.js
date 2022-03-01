/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable("livros", (table) => {
        table.increments("id").primary();
        table.string("titulo").notNullable().unique();
        table.string("edicao").notNullable();
        table.string("descricao");
        table.integer("ideditora").notNullable();
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable("livros");
};
