exports.up = function(knex, Promise) {
  return knex.schema.createTable("articles", articlesTable => {
    articlesTable.increments("article_id").primary();
    articlesTable.string("title").notNullable();
    articlesTable.string("body", 2000);
    articlesTable.integer("votes").defaultTo(0);
    articlesTable.string("topic");
    articlesTable.foreign("topic").references("topics.slug");
    articlesTable.string("author");
    articlesTable.foreign("author").references("users.username");
    articlesTable.datetime("created_at").defaultTo(knex.fn.now(6));
  });
};

exports.down = function(knex, Promise) {
  console.log("removing articles table...");
  return knex.schema.dropTable("articles");
};
