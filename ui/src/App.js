import React, { Component } from "react";
import { ApolloProvider } from "react-apollo";
import ApolloClient from "apollo-boost";
import { withStyles } from "@material-ui/core/styles";
import withRoot from "./withRoot";

import CustomerList from "./containers/CustomerList";

const styles = theme => ({
  root: {
    textAlign: "center",
    paddingTop: theme.spacing.unit * 20
  }
});

const client = new ApolloClient({
  // Being verbose here, this is the default.
  uri: "/graphql"
});

class App extends Component {
  render() {
    return (
      <ApolloProvider client={client}>
        <div>
          <CustomerList />
        </div>
      </ApolloProvider>
    );
  }
}

export default withRoot(withStyles(styles)(App));
