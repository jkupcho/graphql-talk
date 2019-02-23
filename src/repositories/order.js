const { knex } = require("../db");
const DataLoader = require("dataloader");

const orderAliases = {
  id: "id",
  customerId: "customer_id",
  paymentType: "payment_type",
  ordered: "ordered_dtm",
  shipped: "shipped_dtm"
};

exports.findOrdersByCustomerId = new DataLoader(ids => {
  return knex
    .table("customer_orders")
    .whereIn("customer_id", ids)
    .select(orderAliases)
    .then(rows => ids.map(id => rows.filter(x => +x.customerId === +id)));
});

exports.findLineItemsByOrderId = new DataLoader(ids => {
  return knex
    .table("order_line_items")
    .whereIn("order_id", ids)
    .select({
      orderId: "order_id",
      productId: "product_id",
      quantity: "quantity"
    })
    .then(rows => ids.map(id => rows.filter(x => +x.orderId === +id)));
});
