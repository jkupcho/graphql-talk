const express = require("express");
const { ApolloServer, gql, ApolloError } = require("apollo-server-express");
const {
  customerRepository,
  orderRepository,
  productRepository
} = require("./repositories");
const db = require("./db");
const { DateTime } = require("./scalars");

// Construct a schema, using GraphQL schema language
const typeDefs = gql`
  scalar DateTime

  input PageInput {
    limit: Int!
    page: Int!
  }

  type Customer {
    id: Int
    firstName: String
    lastName: String
    email: String
    phone: String
    address: Address
    orders: [Order]
  }

  type Address {
    streetAddress: String
    city: String
    state: String
    zipCode: String
  }

  type Order {
    id: Int
    customer: Customer
    paymentType: String
    ordered: DateTime
    shipped: DateTime
    lineItems: [LineItem]
  }

  type CustomerPage {
    customers: [Customer]
    pageInfo: PageInfo
  }

  type PageInfo {
    limit: Int!
    page: Int!
    hasNext: Boolean!
    numPages: Int!
  }

  type LineItem {
    product: Product
    quantity: Int
  }

  type Product {
    name: String
    company: String
    retailPrice: Float
    sku: String
  }

  type Query {
    customers(pageInput: PageInput!): CustomerPage
    customerOrders(customerId: Int!): [Order]
    customer(id: Int!): Customer
  }
`;

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
      return context.orderRepository.findOrdersByCustomerId(args.customerId);
    },
    customer: (parent, { id }, context) => {
      return context.customerRepository.findById(id);
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
    }
  },
  LineItem: {
    product: (lineItem, args, context, info) => {
      return context.productRepository.findById(lineItem.productId);
    }
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
