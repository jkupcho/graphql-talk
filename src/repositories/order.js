const { knex } = require('../db');

exports.findByCustomerId = async customerId => {
  try {
    return await knex
      .select({
        id: 'id',
        customerId: 'customer_id',
        paymentType: 'payment_type',
        ordered: 'ordered_dtm',
        shipped: 'shipped_dtm'
      })
      .from('customer_orders')
      .where('customer_id', '=', customerId)
      .map(customer => ({
        ...customer,
        ordered: new Date(customer.ordered).toISOString(),
        shipped: new Date(customer.shipped).toISOString()
      }));
  } catch (err) {
    console.error(err);
  }
};

exports.findLineItemsByOrderId = async orderId => {
  try {
    return await knex
      .select({
        orderId: 'order_id',
        productId: 'product_id',
        quantity: 'quantity'
      })
      .from('order_line_items')
      .where('order_id', '=', orderId)
      .map(orderLineItem => orderLineItem);
  } catch (err) {
    console.error(err);
  }
};
