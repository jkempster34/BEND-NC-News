const articlesRouter = require("express").Router();
const { methodNotAllowed } = require("../errors");
const { getAllArticles } = require("../controllers/articles-controller");

articlesRouter
  .route("/")
  .get(getAllArticles)
  .all(methodNotAllowed);

module.exports = articlesRouter;
