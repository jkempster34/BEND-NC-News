const topicsRouter = require("express").Router();
const { methodNotAllowed } = require("../errors");
const { getAllTopics } = require("../controllers/topics-controller");

topicsRouter
  .route("/")
  .get(getAllTopics)
  .all(methodNotAllowed);

module.exports = topicsRouter;
