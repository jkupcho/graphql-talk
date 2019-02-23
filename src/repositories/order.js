const { knex } = require("../db");
const DataLoader = require("dataloader");

exports.findOrdersByCustomerId = new DataLoader(ids => {
  return knex
    .table("customer_orders")
    .whereIn("customer_id", ids)
    .select({
      id: "id",
      customerId: "customer_id",
      paymentType: "payment_type",
      ordered: "ordered_dtm",
      shipped: "shipped_dtm"
    })
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
