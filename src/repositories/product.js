const { knex } = require('../db');
const DataLoader = require('dataloader');

exports.createLoaders = () => ({
  findById: new DataLoader(ids => {
    return knex
      .table('products')
      .whereIn('id', ids)
      .select({
        id: 'id',
        name: 'product_name',
        company: 'company_name',
        retailPrice: 'retail_price',
        sku: 'sku'
      })
      .then(rows => ids.map(id => rows.find(x => x.id === +id)));
  })
});
