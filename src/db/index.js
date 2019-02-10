const { Pool } = require('pg');

const pool = new Pool();

exports.query = async (sql, cb) => {
  try {
    const results = await pool.query(sql);
    return cb(results);
  } catch (err) {
    console.error(err);
  }
};

exports.close = () => {
  console.log('closing pool');
  pool.end();
  console.log('closed pool');
};
