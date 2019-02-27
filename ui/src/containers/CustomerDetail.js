import React from "react";
import { Query } from "react-apollo";

import { GET_CUSTOMER } from "../graphql/customer";
import CustomerProfile from "../components/CustomerProfile";

export default ({ match }) => {
  return (
    <Query
      query={GET_CUSTOMER}
      variables={{
        id: +match.params.customerId,
        withOrders: true,
        withLineItems: true
      }}
    >
      {({ loading, error, data }) => {
        if (loading) return null;
        if (error) return `Error!: ${error}`;

        const { customer } = data;

        return <CustomerProfile customer={customer} />;
      }}
    </Query>
  );
};
