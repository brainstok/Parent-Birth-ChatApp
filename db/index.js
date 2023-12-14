const pgp = require("pg-promise")();
const newDb = require("pg-mem").newDb;

let ssl = null;
// if (process.env.NODE_ENV === "staging") {
ssl = { rejectUnauthorized: false };
// }

const config = {
  host: process.env.PSQL_HOST,
  port: 5432,
  database: process.env.PSQL_DATABASE,
  user: process.env.PSQL_USER,
  password: process.env.PSQL_PASSWORD,
  max: 30, // use up to 30 connections
  ssl: ssl,
};

let _db = pgp(config);

//If we are running tests lets use inmemory DB
if (process.env.JEST_WORKER_ID !== undefined) {
  _db = newDb().adapters.createPgPromise();
}

const db = _db;

module.exports = db;
