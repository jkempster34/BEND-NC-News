const {
  fetchAllArticles,
  fetchArticleById,
  doesUsernameExist,
  doesTopicExist,
  updateAnArticleById,
  fetchCommentsByArticleById,
  insertNewCommentByArticleId
} = require("../models/articles-model");

exports.getAllArticles = (req, res, next) => {
  const validColumns = [
    "username",
    "author",
    "title",
    "article_id",
    "topic",
    "created_at",
    "votes",
    "comment_count"
  ];
  if (!validColumns.includes(req.query.sort_by)) {
    req.query.sort_by = undefined;
  }
  const articlesPromise = fetchAllArticles(req.query);
  const userNamePromise = doesUsernameExist(req.query);
  const topicPromise = doesTopicExist(req.query);

  Promise.all([userNamePromise, topicPromise, articlesPromise])
    .then(([username, topic, articles]) => {
      if (username !== undefined && username.length === 0)
        return Promise.reject({ status: 404, msg: "Username not found" });
      if (topic !== undefined && topic.length === 0)
        return Promise.reject({ status: 404, msg: "Topic not found" });
      res.status(200).send({ articles });
    })
    .catch(next);
};

exports.getArticleById = (req, res, next) => {
  fetchArticleById(req.params)
    .then(article => {
      if (article === undefined)
        return Promise.reject({
          status: 404,
          msg: "Article_id not found"
        });
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.patchArticleById = (req, res, next) => {
  updateAnArticleById(req.body, req.params)
    .then(article => {
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.getCommentsByArticleId = (req, res, next) => {
  fetchCommentsByArticleById(req.params)
    .then(comments => {
      if (comments.length === 0)
        return Promise.reject({ status: 404, msg: "Article_id not found" });
      res.status(200).send({ comments });
    })
    .catch(next);
};

exports.postCommentByArticleId = (req, res, next) => {
  insertNewCommentByArticleId(req.body, req.params)
    .then(comment => {
      res.status(201).send({ comment });
    })
    .catch(next);
};
