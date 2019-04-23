process.env.NODE_ENV = "test";

const { expect } = require("chai");
const supertest = require("supertest");

const app = require("../app");
const connection = require("../db/connection");

const request = supertest(app);

describe.only("/", () => {
  beforeEach(() => connection.seed.run());
  after(() => connection.destroy());

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
        return request.get("/api/articles?sort_by=votes").then(({ body }) => {
          expect(body.articles[0].votes).to.equal(100);
          expect(body.articles[0].comment_count).to.equal("13");
        });
      });
      it("GET - status 200 - can specify order of sort as ascending", () => {
        return request
          .get("/api/articles?sort_by=votes&&order=asc")
          .then(({ body }) => {
            expect(body.articles[0].votes).to.equal(0);
            expect(body.articles[0].comment_count).to.equal("0");
          });
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
    });
  });
});
// TEST FOR ERRORS FOR ONES YOU HAVE DONE
// do i need two models - DRY
// ask about uggo routes
// dont get sql errors any more
