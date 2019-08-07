const express = require("express");
const { ApolloServer, ApolloError } = require("apollo-server-express");
const {
  customerRepository,
  orderRepository,
  productRepository
} = require("./repositories");
const db = require("./db");
const { DateTime } = require("./scalars");
const { typeDefs } = require("./schema");
const contrived = require("./contrived.json");

class AddressNotFound extends ApolloError {
  constructor(message) {
    super(message);
  }
}

// Provide resolver functions for your schema fields
const resolvers = {
  DateTime,
  Query: {
    customers: (parent, args, context, info) => {
      const {
        pageInput: { limit, page }
      } = args;
      return context.customerRepository.findAll(limit, page);
    },
    customerOrders: (parent, args, context, info) => {
      return context.orderRepository.findOrdersByCustomerId(+args.customerId);
    },
    customer: (parent, args, context) => {
      return context.customerRepository.findById(+args.id);
    },
    order: (parent, args, context) => {
      return context.orderRepository.orderById(+args.id);
    },
    orderPayments: () => contrived
  },
  Mutation: {
    PlaceOrder: (_, { order }, context) => {
      return context.orderRepository.placeOrder(order);
    }
  },
  // Example List Resolver.
  Customer: {
    address: (customer, args, context, info) => {
      if (!customer.address) {
        // this allows an error object to show along with data.
        throw new AddressNotFound(`No address for customer: ${customer.id}`);
      }
      return customer.address;
    },
    orders: (customer, args, context, info) => {
      return context.orderRepository.findOrdersByCustomerId(customer.id);
    }
  },
  Order: {
    lineItems: (order, args, context, info) => {
      return context.orderRepository.findLineItemsByOrderId(order.id);
    },
    customer: async (order, args, context) => {
      const { customerId } = await context.orderRepository.orderById(order.id);
      // dataloader returns an array
      return await context.customerRepository.findById(customerId);
    },
    paymentType: async (order, args, context, info) => {
      const { id } = order;
      const { paymentType } = await context.orderRepository.orderById(id);

      return paymentType;
    },
    ordered: async (order, args, context, info) => {
      const { id } = order;
      const { ordered } = await context.orderRepository.orderById(id);

      return ordered;
    },
    shipped: async (order, args, context, info) => {
      const { id } = order;
      const { shipped } = await context.orderRepository.orderById(id);

      return shipped;
    }
  },
  LineItem: {
    product: (lineItem, args, context, info) => {
      return context.productRepository.findById(lineItem.productId);
    }
  },
  Payment: {
    __resolveType(obj, context, info) {
      return resolvePayment(obj, info);
    }
  },
  OrderPayment: {
    __resolveType(obj, context, info) {
      return resolvePayment(obj, info);
    }
  }
};

const resolvePayment = (obj, info) => {
  if (obj.authorizationCode) {
    return "Credit";
  }
  if (obj.bankAuthCode) {
    return "Debit";
  }
  if (obj.chargeBack) {
    // this does the same thing, old way of doing it
    return info.schema.getType("PayPal");
  }
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => ({
    // per request dataloader
    customerRepository: customerRepository.createLoaders(),
    orderRepository: orderRepository.createLoaders(),
    productRepository: productRepository.createLoaders()
  })
});

const app = express();

server.applyMiddleware({ app });

const port = 4000;

app.listen({ port }, () => {
  console.log(
    `🚀 Server ready at http://localhost:${port}${server.graphqlPath}`
  );
});

process.on("exit", () => {
  console.log("start exit");
  db.close();
  console.log("end exit");
});

process.on("SIGINT", () => {
  console.log("caught interrupted");
  process.exit(0);
});
