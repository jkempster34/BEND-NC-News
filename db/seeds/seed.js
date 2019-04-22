const { articleData, commentData, topicData, userData } = require("../data");
const {
  timeStampToDate,
  changeNameOfKey,
  createLookupObject,
  swapOutAKey
} = require("../../utils/manipulate-data");

exports.seed = (knex, Promise) => {
  return knex.migrate
    .rollback()
    .then(() => knex.migrate.latest())
    .then(() => {
      return knex("users")
        .insert(userData)
        .returning("*");
    })
    .then(userData => {
      return knex("topics")
        .insert(topicData)
        .returning("*");
    })
    .then(topicData => {
      const timesChangedToISO = timeStampToDate(articleData);
      return knex("articles")
        .insert(timesChangedToISO)
        .returning("*");
    })
    .then(articleData => {
      const createdByToAuthor = changeNameOfKey(commentData);
      const articleTimesChangedToISO = timeStampToDate(createdByToAuthor);
      const lookupArticleId = createLookupObject(articleData);
      const swappedKey = swapOutAKey(articleTimesChangedToISO, lookupArticleId);
      return knex("comments")
        .insert(swappedKey)
        .returning("*");
    });
};

// use promise.all?
