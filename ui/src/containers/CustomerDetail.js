import React, { useState } from "react";
import { Query } from "react-apollo";

import { GET_CUSTOMER } from "../graphql/customer";
import CustomerProfile from "../components/CustomerProfile";
import CustomerOrderDetail from "../components/CustomerOrderDetail";

export default ({ match }) => {
  const [orderDetail, setOrderDetail] = useState({ show: false, order: {} });

  const handleOrderClick = order => {
    console.log("in handleOrderClick");
    setOrderDetail({ show: true, order });
  };

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
        let customerOrderDetail = null;
        if (orderDetail.show) {
          customerOrderDetail = (
            <CustomerOrderDetail order={orderDetail.order} />
          );
        }

        return (
          <>
            <CustomerProfile
              customer={customer}
              handleOrderClick={handleOrderClick}
            />

            {customerOrderDetail}
          </>
        );
      }}
    </Query>
  );
};
