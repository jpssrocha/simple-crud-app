/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable("publicacao", (table) => {
        table.integer("idpub").notNullable();
        table.integer("ano_publicacao").notNullable();
        table.integer("livro_id").notNullable();
        table.string("nome_edicao");
        table.foreign("livro_id").references("livros.id");
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable("publicacao");
};
