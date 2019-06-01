# Northcoders News API

Northcoders News is a website comprising of user-generated articles in a bulletin board system. This content can be discussed through comments, and each article or comment can be rated by means of a votes system. It was built as part of the Developer Pathway, a 12-week coding bootcamp at Northcoders in Manchester.

The back end layer of Northcoders News offers a CRUD based REST Web API built in Express.js and Node.js, with a postgreSQL database. All data should be received and sent in the JSON format.

The deployed back end can be found at: https://nc-news-joseph-kempster.herokuapp.com/api

The front end can be found at: https://github.com/jkempster34/FEND-NC-News

## Getting Started

### Prerequisites

- Node.js
- npm
- git
- PostgreSQL

To confirm that you have the prerequisites installed, the following terminal commands should return a version number:

```js
node --version
npm --version
git --version
postgres --version
```

### Installing

### To get a copy of this project running on your local machine:

Clone the project:

```js
git clone https://github.com/jkempster34/BEND-NC-News.git
```

Navigate to the project, and install the dependencies in the local node_modules folder:

```js
npm install
```

### knexfile.js

You must create a knexfile.js at the root of the project to connect to the database. Paste the following into the file; Mac OSX users can omit the username and password fields, Linux users must create a new role when installing PostgreSQL and can use those credentials.

```javascript
const { DB_URL } = process.env;
const ENV = process.env.NODE_ENV || "development";

const baseConfig = {
  client: "pg",
  migrations: {
    directory: "./db/migrations"
  },
  seeds: {
    directory: "./db/seeds"
  }
};

const customConfigs = {
  development: {
    connection: {
      database: "nc_news"
      // username: "",
      // password: "",
    }
  },
  test: {
    connection: {
      database: "nc_news_test"
      // username: "",
      // password: "",
    }
  },
  production: {
    connection: `${DB_URL}?ssl=true`
  }
};

module.exports = { ...baseConfig, ...customConfigs[ENV] };
```

Create databases:

```js
npm run setup-dbs
```

Seed databases:

```js
npm run seed
```

Migrate to the latest version:

```js
npm run migrate-latest
```

Run the app on http://localhost:9090 using nodemon which automatically restarts the application when file changes in the directory are detected:

```js
npm run dev
```

A http GET request to http://localhost:9090/api returns a JSON listing all the available endpoints on the API including their request methods, a description, any queries, and an example response.

## Running the tests

To run tests on your local machine:

```js
npm test
```

This will run two tests files, app.spec.js and utils.spec.js using the Mocha test framework. app.spec.js contains tests relating the all of the available API endpoints and their request methods. utils.spec.js contains utility functions which are used for data manipulation.

An example test to /api:

```js
it("GET - status:200 - returns a JSON describing all the available endpoints on your API", () => {
  return request
    .get("/api")
    .expect(200)
    .then(({ body }) => {
      expect(body["GET /api"]).to.eql({
        description:
          "serves up a json representation of all the available endpoints of the api"
      });
    });
});
```

## Built With

- [Node.JS](https://nodejs.org)
- [CORS](https://www.npmjs.com/package/cors)
- [Express](https://expressjs.com/)
- [Knex.js](https://knexjs.org)
- [PostgreSQL](https://www.postgresql.org/)
- [Chai](https://www.chaijs.com/)
- [Mocha](https://mochajs.org/)
- [SuperTest](https://github.com/visionmedia/supertest)
- [Nodemon](https://nodemon.io/)

## Authors

**Joseph Kempster** - _Initial work_ - [jkempster34](https://github.com/jkempster34)
