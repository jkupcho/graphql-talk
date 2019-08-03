import React, { Component } from "react";
import { ApolloProvider } from "react-apollo";
import { BrowserRouter as Router, Route } from "react-router-dom";
import ApolloClient from "apollo-boost";
import { withStyles } from "@material-ui/core/styles";
import withRoot from "./withRoot";

import CustomerList from "./containers/CustomerList";
import CustomerDetail from "./containers/CustomerDetail";

const styles = theme => ({
  root: {
    textAlign: "center",
    paddingTop: theme.spacing(20)
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
        <Router>
          <div>
            <Route exact path="/" component={CustomerList} />
            <Route path="/customer/:customerId" component={CustomerDetail} />
          </div>
        </Router>
      </ApolloProvider>
    );
  }
}

export default withRoot(withStyles(styles)(App));
