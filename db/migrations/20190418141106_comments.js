exports.up = function(knex, Promise) {
  return knex.schema.createTable("comments", commentsTable => {
    commentsTable.increments("comment_id").primary();
    commentsTable.string("author").notNullable();
    commentsTable.foreign("author").references("users.username");
    commentsTable.integer("article_id").notNullable();
    commentsTable.foreign("article_id").references("articles.article_id");
    commentsTable.integer("votes").defaultTo(0);
    commentsTable.datetime("created_at").defaultTo(knex.fn.now(6));
    commentsTable.string("body", 2000).notNullable();
  });
};

exports.down = function(knex, Promise) {
  // console.log("removing comments table...");
  return knex.schema.dropTable("comments");
};
