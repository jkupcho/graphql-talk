const { knex, query } = require('../db');

exports.findById = async id => {
  try {
    return knex
      .select({
        id: 'id',
        name: 'product_name',
        company: 'company_name',
        retailPrice: 'retail_price',
        sku: 'sku'
      })
      .from('products')
      .where('id', '=', id)
      .first()
      .then(product => product);
  } catch (err) {
    console.error(err);
  }
};
