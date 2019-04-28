const connection = require("../db/connection");

exports.fetchUserByUsername = ({ username }) => {
  if (username !== undefined) {
    return connection
      .select("*")
      .from("users")
      .where("username", "=", username);
  }
};
