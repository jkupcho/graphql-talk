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

const styles = theme => ({
  root: {
    width: "80%",
    marginLeft: "auto",
    marginRight: "auto",
    marginTop: theme.spacing.unit * 3,
    overflowX: "auto"
  },
  table: {
    minWidth: 700
  },
  row: {
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.background.default
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

export const CustomerBody = withStyles(styles)(({ classes, customers }) => (
  <TableBody>
    {customers.map(({ id, firstName, lastName, orders }) => (
      <TableRow key={id} className={classes.row}>
        <TableCell scope="row">{firstName}</TableCell>
        <TableCell align="right">{lastName}</TableCell>
        <TableCell align="right">{orders.length}</TableCell>
      </TableRow>
    ))}
  </TableBody>
));

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
    <Table className={classes.table}>{children}</Table>
  </Paper>
));
