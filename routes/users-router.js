const usersRouter = require("express").Router();
const { methodNotAllowed } = require("../errors");
const { getUserByUsername } = require("../controllers/users-controller");

usersRouter
  .route("/:username")
  .get(getUserByUsername)
  .all(methodNotAllowed);

module.exports = usersRouter;
