const connection = require("../db/connection");

exports.updateCommentByCommentId = (body, { comment_id }) => {
  if (Object.keys(body).length === 0) {
    return connection("comments")
      .where("comment_id", "=", comment_id)
      .returning("*")
      .then(([result]) => result);
  }
  if (body.inc_votes === undefined || Object.keys(body).length > 1) {
    return Promise.reject({
      status: 400,
      msg: "Not valid patch body"
    });
  }
  if (!Number.isInteger(body.inc_votes)) {
    return Promise.reject({
      status: 400,
      msg: "inc_votes must be an integer"
    });
  }
  return connection("comments")
    .where("comment_id", "=", comment_id)
    .increment("votes", body.inc_votes)
    .returning("*")
    .then(([result]) => result);
};

exports.removeAComment = ({ comment_id }) => {
  return connection("comments")
    .where("comment_id", "=", comment_id)
    .del();
};
