const { Pool } = require('pg');

const pool = new Pool();

exports.query = async sql => {
  const client = await pool.connect();
  try {
    return await client.query(sql);
  } catch (err) {
    console.error(err);
  } finally {
    client.release();
  }
};

exports.close = () => {
  console.log('closing pool');
  pool.end();
  console.log('closed pool');
};
