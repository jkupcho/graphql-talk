const { knex } = require('../db');
const DataLoader = require('dataloader');

exports.createLoaders = () => {
  const ordersByCustomerIdLoader = new DataLoader(ids => {
    return knex
      .table('customer_orders')
      .whereIn('customer_id', ids)
      .select({
        id: 'id',
        customerId: 'customer_id',
        paymentType: 'payment_type',
        ordered: 'ordered_dtm',
        shipped: 'shipped_dtm'
      })
      .then(rows => ids.map(id => rows.filter(x => +x.customerId === +id)))
      .map(customers => {
        return customers.map(customer => ({
          ...customer,
          ordered: customer.ordered.toISOString(),
          shipped: customer.shipped.toISOString()
        }));
      });
  });
  const lineItemsByOrderIdLoader = new DataLoader(ids => {
    return knex
      .table('order_line_items')
      .whereIn('order_id', ids)
      .select({
        orderId: 'order_id',
        productId: 'product_id',
        quantity: 'quantity'
      })
      .then(rows => ids.map(id => rows.filter(x => +x.orderId === +id)));
  });

  const placeOrder = async order => {
    const insertedOrderId = await knex
      .table('customer_orders')
      .returning('id')
      .insert({
        customer_id: order.customerId,
        payment_type: order.paymentType,
        ordered_dtm: new Date()
      });

    console.log(`Insert ID: ${insertedOrderId}`);

    await Promise.all(
      order.lineItems.map(({ productId, quantity }) => {
        return knex.table('order_line_items').insert({
          order_id: +insertedOrderId,
          product_id: +productId,
          quantity
        });
      })
    );
  };

  return {
    findOrdersByCustomerId: id => ordersByCustomerIdLoader.load(id),
    findLineItemsByOrderId: id => lineItemsByOrderIdLoader.load(id),
    placeOrder
  };
};
