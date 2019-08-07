const { gql } = require("apollo-server-express");

// Construct a schema, using GraphQL schema language
exports.typeDefs = gql`
  scalar DateTime

  interface Payment {
    id: ID!
    total: Float!
  }

  type Credit implements Payment {
    id: ID!
    total: Float!
    authorizationCode: String!
  }

  type Debit implements Payment {
    id: ID!
    total: Float!
    bankAuthCode: String!
  }

  type PayPal implements Payment {
    id: ID!
    total: Float!
    chargeBack: Boolean!
  }

  union OrderPayment = Credit | Debit | PayPal

  input PageInput {
    limit: Int!
    page: Int!
  }

  type Customer {
    id: ID
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
    id: ID
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
    customerOrders(customerId: ID!): [Order]
    customer(id: ID!): Customer
    order(id: ID!): Order
    orderPayments: [OrderPayment]
  }

  input LineItemInput {
    productId: Int!
    quantity: Int!
  }

  input PlaceOrderInput {
    customerId: Int
    paymentType: String
    lineItems: [LineItemInput]
  }

  type Mutation {
    PlaceOrder(order: PlaceOrderInput!): Order
  }
`;
