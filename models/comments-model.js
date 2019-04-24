const connection = require("../db/connection");

exports.updateCommentByCommentId = ({ inc_votes }, { comment_id }) => {
  return connection("comments")
    .where("comment_id", "=", comment_id)
    .increment("votes", inc_votes)
    .returning("*")
    .then(([result]) => result);
};
