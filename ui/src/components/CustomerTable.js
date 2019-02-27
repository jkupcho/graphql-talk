import React from "react";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableFooter from "@material-ui/core/TableFooter";
import TablePagination from "@material-ui/core/TablePagination";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import { withStyles } from "@material-ui/core/styles";
import { withRouter } from "react-router-dom";
import { Typography } from "@material-ui/core";

const styles = theme => ({
  root: {
    width: "80%",
    marginLeft: "auto",
    marginRight: "auto",
    marginTop: theme.spacing.unit * 3,
    overflowX: "auto"
  },
  headerPadding: {
    padding: 25
  },
  table: {
    minWidth: 700
  },
  row: {
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.background.default
    },
    "&:hover": {
      backgroundColor: "#ddd",
      textDecoration: "underline",
      cursor: "pointer"
    }
  }
});

export const CustomerFooter = ({
  pageInfo: { numPages, page, limit },
  handleChangePage,
  handleChangeRowsPerPage
}) => (
  <TableFooter>
    <TableRow>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        colSpan={3}
        count={numPages * limit}
        rowsPerPage={limit}
        page={page}
        SelectProps={{
          native: true
        }}
        onChangeRowsPerPage={handleChangeRowsPerPage}
        onChangePage={handleChangePage}
      />
    </TableRow>
  </TableFooter>
);

const CustomerRow = withRouter(
  ({
    customer: { id, firstName, lastName, orders },
    classes,
    getCustomer,
    history
  }) => {
    let timeoutVal = null;

    // Prefetch after 600ms.
    const handleMouseOver = () => {
      timeoutVal = setTimeout(getCustomer.bind(this, id), 600);
    };

    const cancelTimeout = () => {
      clearTimeout(timeoutVal);
    };

    const navigate = () => {
      history.push(`/customer/${id}`);
    };

    return (
      <TableRow
        className={classes.row}
        onMouseOver={handleMouseOver}
        onMouseOut={cancelTimeout}
        onClick={navigate}
      >
        <TableCell scope="row">{firstName}</TableCell>
        <TableCell align="right">{lastName}</TableCell>
        <TableCell align="right">{orders.length}</TableCell>
      </TableRow>
    );
  }
);

export const CustomerBody = withStyles(styles)(
  ({ classes, customers, getCustomer }) => {
    return (
      <TableBody>
        {customers.map(customer => (
          <CustomerRow
            key={customer.id}
            classes={classes}
            customer={customer}
            getCustomer={getCustomer}
          />
        ))}
      </TableBody>
    );
  }
);

export const CustomerHeader = () => (
  <TableHead>
    <TableRow>
      <TableCell>First Name</TableCell>
      <TableCell align="right">Last Name</TableCell>
      <TableCell align="right">Num. Orders</TableCell>
    </TableRow>
  </TableHead>
);

export const CustomerTable = withStyles(styles)(({ children, classes }) => (
  <Paper className={classes.root}>
    <Typography component="h2" variant="h2" className={classes.headerPadding}>
      Customers
    </Typography>
    <Table className={classes.table}>{children}</Table>
  </Paper>
));
