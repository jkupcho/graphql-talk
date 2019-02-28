const { gql } = require("apollo-server-express");

// Construct a schema, using GraphQL schema language
exports.typeDefs = gql`
  scalar DateTime

  interface Payment {
    id: Int!
    total: Float!
  }

  type Credit implements Payment {
    id: Int!
    total: Float!
    authorizationCode: String!
  }

  type Debit implements Payment {
    id: Int!
    total: Float!
    bankAuthCode: String!
  }

  type PayPal implements Payment {
    id: Int!
    total: Float!
    chargeBack: Boolean!
  }

  union OrderPayment = Credit | Debit | PayPal

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
    orderPayments: [OrderPayment]
  }
`;
