import React, { useState } from "react";
import { Query } from "react-apollo";
import { gql } from "apollo-boost";

import {
  CustomerBody,
  CustomerFooter,
  CustomerHeader,
  CustomerTable
} from "../components/Customer";

const GET_CUSTOMERS = gql`
  query Customers($limit: Int, $page: Int) {
    getCustomers(limit: $limit, page: $page) {
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

export default () => {
  const [limit, setLimit] = useState(5);
  const [page, setPage] = useState(0);

  const handleChangePage = (evt, page) => setPage(page);

  const handleChangeRowsPerPage = evt => {
    setPage(0);
    setLimit(+evt.target.value);
  };

  return (
    <Query query={GET_CUSTOMERS} variables={{ limit, page }}>
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
            variables: { page: page + 1, limit }
          });
        }

        return (
          <CustomerTable>
            <CustomerHeader />
            <CustomerBody customers={customers} />
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
};
