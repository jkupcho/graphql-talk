import React from "react";
import { Query } from "react-apollo";

import { GET_CUSTOMER } from "../graphql/customer";

export default ({ match }) => {
  return (
    <Query query={GET_CUSTOMER} variables={{ id: +match.params.customerId }}>
      {({ loading, error, data }) => {
        if (loading) return null;
        if (error) return `Error!: ${error}`;

        const {
          customer: { firstName, lastName, email }
        } = data;

        return (
          <span>
            Customer: {firstName} {lastName} {email}
          </span>
        );
      }}
    </Query>
  );
};
