const commentsRouter = require("express").Router();
const { methodNotAllowed } = require("../errors");
const {
  patchCommentByCommentId,
  deleteAComment
} = require("../controllers/comments-controller");

commentsRouter
  .route("/:comment_id")
  .patch(patchCommentByCommentId)
  .delete(deleteAComment)
  .all(methodNotAllowed);

module.exports = commentsRouter;
