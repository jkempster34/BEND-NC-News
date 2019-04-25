const {
  updateCommentByCommentId,
  removeAComment
} = require("../models/comments-model");

exports.patchCommentByCommentId = (req, res, next) => {
  updateCommentByCommentId(req.body, req.params)
    .then(comment => {
      res.status(200).send({ comment });
    })
    .catch(next);
};

exports.deleteAComment = (req, res, next) => {
  removeAComment(req.params).then(() => {
    res.sendStatus(204);
  });
};
