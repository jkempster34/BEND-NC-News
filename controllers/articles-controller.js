const {
  fetchAllArticles,
  fetchArticleById
} = require("../models/articles-model");

exports.getAllArticles = (req, res, next) => {
  fetchAllArticles(req.query)
    .then(articles => {
      res.status(200).send({ articles });
    })
    .catch(next);
};

exports.getArticleById = (req, res, next) => {
  fetchArticleById(req.params)
    .then(article => {
      console.log(article);
      res.status(200).send({ article });
    })
    .catch(next);
};
