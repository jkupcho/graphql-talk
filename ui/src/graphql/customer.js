import { gql } from "apollo-boost";

export const GET_CUSTOMERS = gql`
  query Customers($pageInput: PageInput!) {
    getCustomers(pageInput: $pageInput) {
      pageInfo {
        limit
        page
        hasNext
        numPages
      }
      customers {
        id
        firstName
        lastName
        orders {
          id
        }
      }
    }
  }
`;

export const GET_CUSTOMER = gql`
  fragment customerFragment on Customer {
    id
    firstName
    lastName
    email
    phone
    address {
      streetAddress
      city
      state
      zipCode
    }
  }

  fragment orderFragment on Order {
    id
    paymentType
    ordered
    shipped
  }

  fragment lineItemFragment on LineItem {
    product {
      name
      company
      retailPrice
      sku
    }
    quantity
  }

  query Customer(
    $id: Int!
    $withOrders: Boolean! = false
    $withLineItems: Boolean! = false
  ) {
    getCustomer(id: $id) {
      ...customerFragment
      orders @include(if: $withOrders) {
        ...orderFragment
        lineItems @include(if: $withLineItems) {
          ...lineItemFragment
        }
      }
    }
  }
`;
