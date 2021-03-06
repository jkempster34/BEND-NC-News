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
    .increment("votes", body.inc_votes || 0)
    .returning("*")
    .then(([result]) => {
      if (result === undefined)
        return Promise.reject({
          status: 404,
          msg: "Id valid but not found"
        });
      return result;
    });
};

exports.removeAComment = ({ comment_id }) => {
  return connection("comments")
    .where("comment_id", "=", comment_id)
    .then(result => {
      if (result.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "Id valid but not found"
        });
      }
      return connection("comments")
        .where("comment_id", "=", comment_id)
        .del();
    });
};
