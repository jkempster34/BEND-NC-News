const connection = require("../db/connection");

exports.fetchUserByUsername = ({ username, author }) => {
  if (username !== undefined) {
    return connection
      .select("*")
      .from("users")
      .where("username", "=", username);
  }
  if (author !== undefined) {
    return connection
      .select("*")
      .from("users")
      .where("username", "=", author);
  }
};
