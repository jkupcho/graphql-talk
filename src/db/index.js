const knex = require("knex")({
  client: "pg",
  connection: {
    host: process.env.PGHOST,
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    database: process.env.PGDATABASE
  },
  searchPath: ["graphql"],
  pool: { min: 0, max: 25 }
});

exports.knex = knex;

exports.close = () => {
  console.log("closing pool");
  knex.destroy().timeout(5000, "knex pool did not close properly.");
  console.log("closed pool");
};
