const faker = require('faker');
const fs = require('fs');

const logError = err => {
  if (err) console.error(err);
};

const writeCurry = fd => {
  return str => {
    fs.write(fd, str, logError);
  };
};

const numCustomers = 2000;
const numProducts = 1000;
const numOrders = numCustomers * 5;

fs.open('customers.csv', 'w', (err, fd) => {
  const writeFile = writeCurry(fd);
  // create an IV for each person and a shared secret for decrypting.
  if (err) throw err;

  for (let i = 0; i < numCustomers; ++i) {
    const firstName = faker.name.firstName();
    const lastName = faker.name.lastName();
    const email = faker.internet.email(firstName, lastName).toLowerCase();
    const phone = faker.phone.phoneNumberFormat();

    const streetAddress = faker.address.streetAddress();
    const city = faker.address.city();
    const state = faker.address.stateAbbr();
    const zipCode = faker.address.zipCode('#####');

    const createdOn = faker.date.past(5, '2019-02-06').toISOString();

    const record = `${firstName},${lastName},${email},${phone},${streetAddress},${city},${state},${zipCode},${createdOn}\n`;
    writeFile(record);
  }
  fs.close(fd, logError);
});

fs.open('products.csv', 'w', (err, fd) => {
  const writeFile = writeCurry(fd);
  if (err) throw err;

  for (let i = 0; i < numProducts; ++i) {
    const productName = faker.commerce.productName();
    const companyName = faker.company.companyName();
    const retailPrice = faker.finance.amount(1, 100, 2);
    const sku = `${faker.random.alphaNumeric(2)}-${faker.random.alphaNumeric(
      4
    )}-${faker.random.alphaNumeric(2)}`;

    const record = `${productName}|${companyName}|${retailPrice}|${sku}\n`;
    writeFile(record);
  }
  fs.close(fd, logError);
});

fs.open('customer_orders.csv', 'w', (err, fd) => {
  const writeFile = writeCurry(fd);
  if (err) throw err;

  for (let i = 0; i < numOrders; ++i) {
    const customerId = faker.random.number({ min: 1, max: numCustomers });
    const paymentMethod = faker.random.arrayElement([
      'Credit',
      'Debit',
      'PayPal',
      'ApplePay'
    ]);
    const orderDate = faker.date.past(5, '2019-02-06');
    const dateOrdered = orderDate.toISOString();
    const dateShipped = new Date(
      orderDate.getFullYear(),
      orderDate.getMonth(),
      orderDate.getDate() + faker.random.number(20)
    ).toISOString();

    const record = `${customerId},${paymentMethod},${dateOrdered},${dateShipped}\n`;
    writeFile(record);
  }

  fs.close(fd, logError);
});

fs.open('order_line_items.csv', 'w', (err, fd) => {
  const writeFile = writeCurry(fd);
  if (err) throw err;

  for (let i = 1; i <= numOrders; ++i) {
    const orderId = i;
    const numLineItems = faker.random.number({ min: 1, max: 10 });

    let productArray = [];

    for (let j = 0; j < numLineItems; ++j) {
      let productId = faker.random.number({ min: 1, max: numProducts });
      // Just make sure the product isn't already in the line items.
      while (productArray.includes(productId)) {
        productId = faker.random.number({ min: 1, max: numProducts });
      }
      productArray.push(productId);
      const quantity = faker.random.number({ min: 1, max: 20 });

      writeFile(`${orderId},${productId},${quantity}\n`);
    }
  }

  fs.close(fd, logError);
});
