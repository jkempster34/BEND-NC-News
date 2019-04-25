process.env.NODE_ENV = "test";

const { expect } = require("chai");
const supertest = require("supertest");

const app = require("../app");
const connection = require("../db/connection");

const request = supertest(app);

describe.only("/", () => {
  beforeEach(() => connection.seed.run());
  after(() => connection.destroy());
  describe("/*** route-not found", () => {
    it('* - status 404 - returns message "route not found"', () => {
      return request
        .get("/api/notaroute")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).to.equal("Route Not Found");
        });
    });
  });
  describe("/api", () => {
    it("GET - status:200", () => {
      return request
        .get("/api")
        .expect(200)
        .then(({ body }) => {
          expect(body.ok).to.equal(true);
        });
    });
    describe("/topics", () => {
      it("GET - status: 200 - returns all topics in a topic object", () => {
        return request
          .get("/api/topics/")
          .expect(200)
          .then(({ body }) => {
            expect(body.topics).to.be.an("array");
            expect(body.topics).to.eql([
              {
                description: "The man, the Mitch, the legend",
                slug: "mitch"
              },
              {
                description: "Not dogs",
                slug: "cats"
              },
              {
                description: "what books are made of",
                slug: "paper"
              }
            ]);
          });
      });
    });
    describe("/articles", () => {
      it("GET - status 200 - returns an array of article objects", () => {
        return request
          .get("/api/articles/")
          .expect(200)
          .then(({ body }) => {
            expect(body.articles).to.be.an("array");
            expect(body.articles).to.deep.include({
              author: "butter_bridge",
              title: "Living in the shadow of a great man",
              article_id: 1,
              topic: "mitch",
              created_at: "2018-11-15T12:21:54.171Z",
              votes: 100,
              comment_count: "13"
            });
          });
      });
      it("GET - status 200 - filters articles by username specified in the query", () => {
        return request
          .get("/api/articles?username=rogersop")
          .expect(200)
          .then(({ body }) => {
            expect(body.articles.length).to.equal(3);
            expect(body.articles[0]).to.contain.keys(
              "author",
              "title",
              "article_id",
              "topic",
              "created_at",
              "votes",
              "comment_count"
            );
            expect(
              body.articles.every(article => {
                return article.author === "rogersop";
              })
            ).to.be.true;
          });
      });
      it("GET - status 200 - filters articles by topic specified in the query", () => {
        return request.get("/api/articles?topic=mitch").then(({ body }) => {
          expect(body.articles.length).to.equal(11);
          expect(
            body.articles.every(article => {
              return article.topic === "mitch";
            })
          ).to.be.true;
        });
      });
      it("GET - status 200 - sorts the articles by date (desc) as default", () => {
        return request.get("/api/articles").then(({ body }) => {
          expect(body.articles[0].created_at).to.equal(
            "2018-11-15T12:21:54.171Z"
          );
        });
      });
      it("GET - status 200 - sorts the articles (desc) by other valid columns", () => {
        return request
          .get("/api/articles?sort_by=comment_count")
          .then(({ body }) => {
            expect(body.articles[1].comment_count).to.equal("2");
            expect(body.articles[0].comment_count).to.equal("13");
          });
      });
      it("GET - status 200 - can specify order of sort as ascending", () => {
        return request
          .get("/api/articles?sort_by=votes&&order=asc")
          .then(({ body }) => {
            expect(body.articles[0].votes).to.equal(0);
            expect(body.articles[11].votes).to.equal(100);
            expect(body.articles[0].comment_count).to.equal("0");
          });
      });
      it("GET - status 200 - sorts articles by default (date) in default order (desc) if the sort_by query is a column that doesn't exist", () => {
        return request.get("/api/articles?sort_by=invalid").then(({ body }) => {
          expect(body.articles[0].created_at).to.equal(
            "2018-11-15T12:21:54.171Z"
          );
        });
      });
      it("GET - status 200 - sorts articles in default order (desc) if the 'order' query is not 'asc' or 'desc'", () => {
        return request.get("/api/articles?order=invalid").then(({ body }) => {
          expect(body.articles[0].created_at).to.equal(
            "2018-11-15T12:21:54.171Z"
          );
        });
      });
      xit("GET - status 404 - returns message 'Not a username' for the query of a username that is not in the database", () => {
        return request
          .get("/api/articles?username=notausername")
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).to.equal("Username not found");
          });
      });
      xit("GET - status 404 - returns message 'Not a topic' for the query of a topic that is not in the database", () => {
        return request
          .get("/api/articles?topic=notatopic")
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).to.equal("Topic not found");
          });
      });
      xit("GET - status 200 - returns an empty array for a username that exists but does not have any articles associated with it", () => {
        return request
          .get("/api/articles?username=lurker")
          .expect(200)
          .then(({ body }) => {
            expect(body).to.equal([]);
          });
      });
      describe("/articles/:article_id", () => {
        it("GET - status 200 - returns a single article based on article_id parameter", () => {
          return request.get("/api/articles/1").then(({ body }) => {
            expect(body.article).to.eql({
              author: "butter_bridge",
              title: "Living in the shadow of a great man",
              article_id: 1,
              topic: "mitch",
              created_at: "2018-11-15T12:21:54.171Z",
              votes: 100,
              comment_count: "13"
            });
          });
        });
        it("PATCH - status 200 - updates an article's votes when passed an object with a positive number", () => {
          const newVotes = { inc_votes: 10 };
          return request
            .patch("/api/articles/1")
            .send(newVotes)
            .expect(200)
            .then(({ body }) => {
              expect(body.article.votes).to.equal(110);
            });
        });
        it("PATCH - status 200 - updates an article's votes when passed an object with a negative number", () => {
          const newVotes = { inc_votes: -10 };
          return request
            .patch("/api/articles/1")
            .send(newVotes)
            .expect(200)
            .then(({ body }) => {
              expect(body.article.votes).to.equal(90);
            });
        });
        describe("/articles/:article_id/:comments", () => {
          it("GET - status 200 - returns an array of comments for the given article_id", () => {
            return request.get("/api/articles/1/comments").then(({ body }) => {
              expect(body.comments.length).to.equal(13);
            });
          });
          it("POST - status 200 - returns the posted comment when passed a comment object", () => {
            const newComment = {
              username: "rogersop",
              body: "Hello, this is a comment"
            };
            return request
              .post("/api/articles/1/comments")
              .send(newComment)
              .expect(201)
              .then(({ body }) => {
                expect(body.comment).to.contain.keys(
                  "comment_id",
                  "author",
                  "body",
                  "votes",
                  "article_id",
                  "created_at"
                );
                expect(body.comment.comment_id).to.equal(19);
                expect(body.comment.author).to.equal("rogersop");
                expect(body.comment.body).to.equal("Hello, this is a comment");
                expect(body.comment.votes).to.equal(0);
                expect(body.comment.article_id).to.equal(1);
              });
          });
        });
      });
      describe("/comments/:comment_id", () => {
        it("PATCH - status 200 - increments the comment's vote property when passed an object", () => {
          const newVotes = { inc_votes: 1 };
          return request
            .patch("/api/comments/1")
            .send(newVotes)
            .expect(200)
            .then(({ body }) => {
              expect(body.comment.body).to.equal(
                "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!"
              );
              expect(body.comment.votes).to.equal(17);
            });
        });
        it("PATCH - status 200 - decreases the comment's vote property when passed an object", () => {
          const newVotes = { inc_votes: -1 };
          return request
            .patch("/api/comments/1")
            .send(newVotes)
            .expect(200)
            .then(({ body }) => {
              expect(body.comment.body).to.equal(
                "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!"
              );
              expect(body.comment.votes).to.equal(15);
            });
        });
        it("DELETE - status 204 - returns no content", () => {
          return request.delete("/api/comments/1").expect(204);
        });
      });
      describe("/users/:username", () => {
        it("GET - status 200 - returns a user object", () => {
          return request.get("/api/users/butter_bridge").then(({ body }) => {
            expect(body.user).to.eql({
              username: "butter_bridge",
              avatar_url:
                "https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg",
              name: "jonny"
            });

            //NEARLY DONE
          });
        });
      });
    });
  });
});
