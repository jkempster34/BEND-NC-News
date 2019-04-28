const { expect } = require("chai");
const {
  timeStampToDate,
  changeNameOfKey,
  createLookupObject,
  swapOutAKey,
  makePOSTCommentSuitable
} = require("../utils/manipulate-data");

describe("timeStampToDate()", () => {
  it("Does not mutate the original array", () => {
    const input = [{ created_at: 1542284514171 }];
    const actual = timeStampToDate(input);
    const output = [{ created_at: "2018-11-15T12:21:54.171Z" }];
    expect(actual).to.eql(output);
    expect(actual[0]).to.eql(output[0]);
    expect(input).to.not.equal(actual);
    expect(input[0]).to.not.equal(actual[0]);
  });
  it("Changes the timestamp into a date format for an array of length one", () => {
    const input = [
      {
        title: "Living in the shadow of a great man",
        topic: "mitch",
        author: "butter_bridge",
        body: "I find this existence challenging",
        created_at: 1542284514171,
        votes: 100
      }
    ];
    const expected = [
      {
        title: "Living in the shadow of a great man",
        topic: "mitch",
        author: "butter_bridge",
        body: "I find this existence challenging",
        created_at: "2018-11-15T12:21:54.171Z",
        votes: 100
      }
    ];
    expect(timeStampToDate(input, "created_at")).to.eql(expected);
  });
  it("Changes the timestamp into a date format for an array of length more than one", () => {
    const input = [
      { created_at: 1542284514171 },
      { created_at: 1478813209256 }
    ];
    expect(timeStampToDate(input, "created_at")).to.eql([
      { created_at: "2018-11-15T12:21:54.171Z" },
      { created_at: "2016-11-10T21:26:49.256Z" }
    ]);
  });
});
describe("changeNameOfKey()", () => {
  it("Does not mutate the original array", () => {
    const input = [{ created_by: "butter_bridge" }];
    const actual = changeNameOfKey(input);
    const output = [{ author: "butter_bridge" }];
    expect(actual).to.eql(output);
    expect(actual[0]).to.eql(output[0]);
    expect(input).to.not.equal(actual);
    expect(input[0]).to.not.equal(actual[0]);
  });
  it("Changes the name of one object key", () => {
    const input = [
      {
        body:
          "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        belongs_to: "They're not exactly dogs, are they?",
        created_by: "butter_bridge",
        votes: 16,
        created_at: 1511354163389
      }
    ];
    const expected = [
      {
        body:
          "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        belongs_to: "They're not exactly dogs, are they?",
        author: "butter_bridge",
        votes: 16,
        created_at: 1511354163389
      }
    ];
    expect(changeNameOfKey(input)).to.eql(expected);
  });
  it("Changes the key's name in mutiple objects in an array", () => {
    const input = [
      {
        created_by: "butter_bridge"
      },
      {
        created_by: "joe"
      }
    ];
    const expected = [
      {
        author: "butter_bridge"
      },
      { author: "joe" }
    ];
    expect(changeNameOfKey(input)).to.eql(expected);
  });
});
describe("createLookupObject()", () => {
  it("Returns new object, when passed an empty array", () => {
    const input = [];
    const actual = createLookupObject(input);
    const output = {};
    expect(actual).to.eql(output);
  });
  it("Returns reference object when passed an array of length one", () => {
    const owner = [
      { owner_id: 1, forename: "firstname-b", surname: "lastname-b", age: 30 }
    ];
    const actual = createLookupObject(owner, "forename", "owner_id");
    const output = { "firstname-b": 1 };
    expect(actual).to.eql(output);
  });
  it("Returns reference object when passed an array of length more than one", () => {
    const owner = [
      {
        owner_id: 1,
        forename: "firstname-b",
        surname: "lastname-b",
        age: 30
      },
      {
        owner_id: 2,
        forename: "firstname-c",
        surname: "lastname-c",
        age: 31
      }
    ];
    const actual = createLookupObject(owner, "forename", "owner_id");
    const output = { "firstname-b": 1, "firstname-c": 2 };
    expect(actual).to.eql(output);
  });
});
describe("swapOutAKey()", () => {
  it("Returns a new array with new object elements", () => {
    const shops = [{}];
    const owners = [];
    const actual = swapOutAKey(shops, owners);
    const output = [{}];
    expect(actual).to.eql(output);
    expect(actual).to.not.equal(shops);
    expect(actual[0]).to.not.equal(shops[0]);
    expect(actual).to.not.equal(owners);
  });
  it("Swaps out a key for another, based on a reference object, for an object in an array of length one", () => {
    const shops = [
      { shop_name: "shop-b", owner: "firstname-b", slogan: "slogan-b" }
    ];
    const owners = { "firstname-b": 1 };
    const actual = swapOutAKey(shops, owners, "owner_id", "owner");
    const output = [{ shop_name: "shop-b", owner_id: 1, slogan: "slogan-b" }];
    expect(actual).to.eql(output);
    expect(actual).to.not.equal(shops);
    expect(actual).to.not.equal(owners);
  });
  it("Works for a longer array", () => {
    const shops = [
      { shop_name: "shop-b", owner: "firstname-b", slogan: "slogan-b" },
      { shop_name: "shop-d", owner: "firstname-c", slogan: "slogan-d" },
      { shop_name: "shop-e", owner: "firstname-d", slogan: "slogan-e" }
    ];
    const owners = { "firstname-b": 1, "firstname-c": 2, "firstname-d": 3 };
    const actual = swapOutAKey(shops, owners, "owner_id", "owner");
    const output = [
      { shop_name: "shop-b", owner_id: 1, slogan: "slogan-b" },
      { shop_name: "shop-d", owner_id: 2, slogan: "slogan-d" },
      { shop_name: "shop-e", owner_id: 3, slogan: "slogan-e" }
    ];
    expect(actual).to.eql(output);
    expect(actual).to.not.equal(shops);
    expect(actual).to.not.equal(owners);
  });
});
describe("makePOSTCommentSuitable()", () => {
  it("Does not mutate original object", () => {
    const input = { username: "rogersop" };
    const actual = makePOSTCommentSuitable(input);
    const output = { author: "rogersop", article_id: undefined };
    expect(actual).to.eql(output);
    expect(input).to.not.equal(actual);
  });
  it("Changes 'username' key to 'author'", () => {
    const input = {
      username: "rogersop",
      body: "Hello, this is a comment"
    };
    const actual = makePOSTCommentSuitable(input);
    expect(actual).to.contain.keys("author", "body");
  });
  it("Returns an object with an article_id key which is passed as a parameter", () => {
    const input = {
      username: "rogersop",
      body: "Hello, this is a comment"
    };
    const article_id = 1;
    const actual = makePOSTCommentSuitable(input, article_id);
    expect(actual).to.eql({
      author: "rogersop",
      body: "Hello, this is a comment",
      article_id: 1
    });
  });
});
