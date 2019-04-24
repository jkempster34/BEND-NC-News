const {
  fetchAllArticles,
  fetchArticleById
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
  fetchAllArticles(req.query)
    .then(articles => {
      res.status(200).send({ articles });
    })
    .catch(next);
};

exports.getArticleById = (req, res, next) => {
  fetchArticleById(req.params)
    .then(article => {
      res.status(200).send({ article });
    })
    .catch(next);
};
