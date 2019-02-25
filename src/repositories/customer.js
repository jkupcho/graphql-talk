const { knex } = require('../db');
const DataLoader = require('dataloader');

const customerAliases = {
  id: 'id',
  email: 'email',
  firstName: 'first_name',
  lastName: 'last_name',
  phone: 'phone',
  streetAddress: 'street_address',
  city: 'city',
  state: 'state_abbr',
  zipCode: 'zip_code'
};

const customerMapper = ({
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
});

exports.findById = new DataLoader(ids => {
  return knex
    .table('customers')
    .whereIn('id', ids)
    .select(customerAliases)
    .then(rows => ids.map(id => rows.find(x => +x.id === +id)))
    .then(customers => customers.map(customerMapper));
});

exports.findAll = async (limit, page) => {
  try {
    const customers = await knex
      .table('customers')
      .limit(limit)
      .offset(page * limit)
      .select(customerAliases)
      .orderBy('last_name')
      .map(customerMapper);

    const { count } = await knex
      .table('customers')
      .count()
      .first();

    const numPages = Math.ceil(count / limit);
    const hasNext = (page + 1) * limit < count;

    const pageInfo = {
      limit,
      page,
      hasNext,
      numPages
    };

    return {
      customers,
      pageInfo
    };
  } catch (err) {
    console.error(err);
  }
};
