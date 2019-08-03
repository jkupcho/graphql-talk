import React, { useState, useEffect } from "react";
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
  const [limit, setLimit] = useState(5);
  const [page, setPage] = useState(0);

  // On component lifecycle, check the search params and update the state.
  useEffect(() => {
    const parsed = qs.parse(location.search);

    const parsedLimit = parsed.limit ? +parsed.limit : 5;
    const parsedPage = parsed.page ? +parsed.page : 0;

    setLimit(parsedLimit);
    setPage(parsedPage);
  }, [location.search]);

  // --- PAGE NAVIGATION HANDLING - Start
  // Replace the router history so if the user navigates backwards the
  // application does not page through all the navigation of the pages.
  const handleChangePage = (evt, page) => {
    history.replace({
      pathname: "/",
      search: qs.stringify({ page, limit })
    });
    setPage(page);
  };

  const handleChangeRowsPerPage = evt => {
    const newLimit = +evt.target.value;

    history.replace({
      pathname: "/",
      search: qs.stringify({ limit: newLimit })
    });
    setPage(0);
    setLimit(newLimit);
  };
  // --- PAGE NAVIGATION HANDLING - End

  return (
    <Query query={GET_CUSTOMERS} variables={{ pageInput: { limit, page } }}>
      {({ loading, error, data, client }) => {
        if (loading) return null;
        if (error) return `Error!: ${error}`;

        const {
          customers: { customers, pageInfo }
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
          <>
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
          </>
        );
      }}
    </Query>
  );
});
