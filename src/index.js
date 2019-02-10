const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');
const customerRepository = require('./repositories/customerRepository');

// Construct a schema, using GraphQL schema language
const typeDefs = gql`
  type Customer {
    id: Int
    firstName: String
    lastName: String
    email: String
    phone: String
    address: Address
  }

  type Address {
    streetAddress: String
    city: String
    state: String
    zipCode: String
  }

  type Query {
    customers: [Customer]
  }
`;

// Provide resolver functions for your schema fields
const resolvers = {
  Query: {
    customers: (parent, args, context, info) => {
      return context.customerRepository.findAll();
    }
  },
  // Example List Resolver.
  // Person: {
  //   address: (person) => {
  //     return person.address ? person.address : { street: "not found!" }
  //   }
  // }
};

const context = {
  customerRepository
};

const server = new ApolloServer({ typeDefs, resolvers, context });

const app = express();
server.applyMiddleware({ app });

const port = 4000;

app.listen({ port }, () =>
  console.log(`🚀 Server ready at http://localhost:${port}${server.graphqlPath}`),
);
