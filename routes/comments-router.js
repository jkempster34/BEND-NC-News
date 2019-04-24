const commentsRouter = require("express").Router();
const { methodNotAllowed } = require("../errors");
const {
  patchCommentByCommentId
} = require("../controllers/comments-controller");

commentsRouter
  .route("/:comment_id")
  .patch(patchCommentByCommentId)
  .all(methodNotAllowed);

module.exports = commentsRouter;
