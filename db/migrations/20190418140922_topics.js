exports.up = function(knex, Promise) {
  return knex.schema.createTable("topics", topicsTable => {
    topicsTable
      .string("slug")
      .primary()
      .unique()
      .notNullable();
    topicsTable.string("description").notNullable();
  });
};

exports.down = function(knex, Promise) {
  // console.log("removing topics table...");
  return knex.schema.dropTable("topics");
};
