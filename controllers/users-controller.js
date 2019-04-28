const { fetchUserByUsername } = require("../models/users-model");

exports.getUserByUsername = (req, res, next) => {
  fetchUserByUsername(req.params)
    .then(([user]) => {
      if (user === undefined)
        return Promise.reject({ status: 404, msg: "Username does not exist" });
      res.status(200).send({ user });
    })
    .catch(next);
};
