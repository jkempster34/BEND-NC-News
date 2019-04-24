const {
  fetchAllArticles,
  fetchArticleById,
  doesUsernameExist,
  doesTopicExist,
  updateAnArticleById,
  fetchCommentsByArticleById,
  insertNewCommentByArticleId
} = require("../models/articles-model");

// exports.getAllArticles = (req, res, next) => {
//   const validColumns = [
//     "username",
//     "author",
//     "title",
//     "article_id",
//     "topic",
//     "created_at",
//     "votes",
//     "comment_count"
//   ];
//   if (!validColumns.includes(req.query.sort_by)) {
//     req.query.sort_by = undefined;
//   }
//   doesUsernameExist(req.query)
//     .then(result => {
//       console.log("************1");
//       if (result.length === 0 && req.query.username !== undefined) {
// return Promise.reject({ status: 404, msg: "Username not found" });
//       } else return result;
//     })
//     .then(() => {
//       console.log("************2");
//       return doesTopicExist(req.query);
//     })
//     .then(result => {
//       console.log("************3");
//       if (result.length === 0 && req.query.topic !== undefined) {
//         return Promise.reject({ status: 404, msg: "Topic not found" });
//       } else return result;
//     })
//     .then(() => {
//       console.log("************4");
//       return fetchAllArticles(req.query);
//     })

//     .catch(next);
// };

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
      return res.status(200).send({ articles });
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
      res.status(200).send({ comments });
    })
    .catch(next);
};

exports.postCommentByArticleId = (req, res, next) => {
  insertNewCommentByArticleId(req.body, req.params).then(comment => {
    res.status(201).send({ comment });
  });
};
