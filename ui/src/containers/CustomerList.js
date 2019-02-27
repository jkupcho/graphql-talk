import React, { useState } from "react";
import { Query } from "react-apollo";
import { withRouter } from "react-router-dom";
import qs from "query-string";

import { GET_CUSTOMER, GET_CUSTOMERS } from "../graphql/customer";
import {
  CustomerBody,
  CustomerFooter,
  CustomerHeader,
  CustomerTable
} from "../components/CustomerTable";

export default withRouter(({ history, location }) => {
  const parsed = qs.parse(location.search);

  const [limit, setLimit] = useState(parsed.limit ? +parsed.limit : 5);
  const [page, setPage] = useState(parsed.page ? +parsed.page : 0);

  const handleChangePage = (evt, page) => {
    history.push({
      pathname: "/",
      search: qs.stringify({ page, limit })
    });
    setPage(page);
  };

  const handleChangeRowsPerPage = evt => {
    const newLimit = +evt.target.value;

    history.push({
      pathname: "/",
      search: qs.stringify({ limit: newLimit })
    });
    setPage(0);
    setLimit(newLimit);
  };

  return (
    <Query query={GET_CUSTOMERS} variables={{ pageInput: { limit, page } }}>
      {({ loading, error, data, client }) => {
        if (loading) return null;
        if (error) return `Error!: ${error}`;

        const {
          getCustomers: { customers, pageInfo }
        } = data;

        // prefetch next page to avoid flashing the div.
        if (page + 1 < pageInfo.numPages) {
          client.query({
            query: GET_CUSTOMERS,
            variables: { pageInput: { page: page + 1, limit } }
          });
        }

        const handleGetCustomer = id => {
          client.query({
            query: GET_CUSTOMER,
            variables: { id, withOrders: true }
          });
        };

        return (
          <CustomerTable>
            <CustomerHeader />
            <CustomerBody
              customers={customers}
              getCustomer={handleGetCustomer}
            />
            <CustomerFooter
              pageInfo={pageInfo}
              handleChangePage={handleChangePage}
              handleChangeRowsPerPage={handleChangeRowsPerPage}
            />
          </CustomerTable>
        );
      }}
    </Query>
  );
});
