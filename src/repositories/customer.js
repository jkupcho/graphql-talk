const { knex } = require("../db");

exports.findAll = async () => {
  try {
    return await knex
      .select({
        id: "id",
        email: "email",
        firstName: "first_name",
        lastName: "last_name",
        phone: "phone",
        streetAddress: "street_address",
        city: "city",
        state: "state_abbr",
        zipCode: "zip_code"
      })
      .from("customers")
      .map(
        ({
          id,
          email,
          firstName,
          lastName,
          phone,
          streetAddress,
          city,
          state,
          zipCode
        }) => ({
          id,
          email,
          firstName,
          lastName,
          phone,
          address: {
            streetAddress,
            city,
            state,
            zipCode
          }
        })
      );
  } catch (err) {
    console.error(err);
  }
};
