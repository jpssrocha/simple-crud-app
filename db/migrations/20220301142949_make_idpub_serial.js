/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.table("publicacao", (table) => {
        table.dropColumn("idpub");
        table.dropForeign("livro_id");
        table.foreign("livro_id").references("livros.id").onDelete("CASCADE");
        table.increments("id_pub");
    });

};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.table("publicacao", (table) => {
        table.dropColumn("id_pub");
        table.dropForeign("livro_id");
        table.foreign("livro_id").references("livros.id");
        table.integer("idpub").notNullable();
    });

};
