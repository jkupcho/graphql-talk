const db = require('../db');

exports.findAll = async () => {
  try {
    const results = await db.query('SELECT * FROM graphql.customer');
    return results.rows.map(
      ({
        id,
        email,
        first_name,
        last_name,
        phone,
        street_address,
        city,
        state_abbr,
        zip_code
      }) => ({
        id,
        firstName: first_name,
        lastName: last_name,
        email,
        phone,
        address: {
          streetAddress: street_address,
          city,
          state: state_abbr,
          zipCode: zip_code
        }
      })
    );
  } catch (err) {
    console.error(err);
  }
};
