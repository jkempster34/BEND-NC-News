const connection = require("../db/connection");
const { makePOSTCommentSuitable } = require("../utils/manipulate-data");

exports.doesUsernameExist = ({ username }) => {
  if (username !== undefined) {
    return connection
      .select("username")
      .from("users")
      .where("username", "=", username)
      .then(result => {
        return result;
      });
  }
};

exports.doesTopicExist = ({ topic }) => {
  if (topic !== undefined) {
    return connection
      .select("slug")
      .from("topics")
      .where("slug", "=", topic)
      .then(result => {
        return result;
      });
  }
};

exports.fetchAllArticles = ({ username, topic, sort_by, order }) => {
  return connection
    .select(
      "articles.author",
      "title",
      "articles.article_id",
      "topic",
      "articles.created_at",
      "articles.votes"
    )
    .from("articles")
    .count({ comment_count: "comments.article_id" })
    .leftJoin("comments", "articles.article_id", "comments.article_id")
    .groupBy("articles.article_id")
    .orderBy(
      sort_by || "created_at",
      order === "asc" || order === "desc" ? order : "desc"
    )
    .modify(query => {
      if (username) query.where("articles.author", "=", username);
      if (topic) query.where("articles.topic", "=", topic);
    });
};

exports.fetchArticleById = ({ article_id }) => {
  return connection
    .select(
      "articles.author",
      "title",
      "articles.article_id",
      "topic",
      "articles.created_at",
      "articles.votes"
    )
    .from("articles")
    .count({ comment_count: "comments.article_id" })
    .leftJoin("comments", "articles.article_id", "comments.article_id")
    .groupBy("articles.article_id")
    .where("articles.article_id", "=", article_id)
    .then(([result]) => result);
};

exports.updateAnArticleById = ({ inc_votes }, { article_id }) => {
  return connection("articles")
    .where("article_id", "=", article_id)
    .increment("votes", inc_votes)
    .returning("*")
    .then(([result]) => result);
};

exports.fetchCommentsByArticleById = ({ article_id }) => {
  return connection
    .select("comment_id", "votes", "created_at", "author", "body")
    .from("comments")
    .where("comments.article_id", "=", article_id);
};

exports.insertNewCommentByArticleId = (body, { article_id }) => {
  const correctlyFormattedData = makePOSTCommentSuitable(body, article_id);
  return connection("comments")
    .insert(correctlyFormattedData)
    .returning("*")
    .then(([result]) => {
      return result;
    });
};
