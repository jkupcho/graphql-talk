import React from "react";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableBody from "@material-ui/core/TableBody";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import Typography from "@material-ui/core/Typography";
import { withStyles } from "@material-ui/core";

const styles = theme => ({
  root: {
    flexGrow: 1,
    width: "1280px",
    margin: "0 auto"
  },
  orderRoot: {
    padding: 25,
    marginRight: 15
  },
  row: {
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.background.default
    },
    "&:hover": {
      cursor: "pointer",
      backgroundColor: "#efefef"
    }
  },
  tableRoot: {
    marginTop: 25
  }
});

function CustomerOrderDetail({ classes, order }) {
  return (
    <Grid container spacing={2} className={classes.root}>
      <Grid item xs={3} />
      <Grid item xs={9}>
        <Paper className={classes.orderRoot}>
          <Typography component="h2" variant="h2">
            Order {order.id}
          </Typography>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Company</TableCell>
                <TableCell>Retail Price</TableCell>
                <TableCell>SKU</TableCell>
                <TableCell>Quantity</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {order.lineItems.map(({ product, quantity }) => (
                <TableRow key={product.sku}>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.company}</TableCell>
                  <TableCell>{product.retailPrice}</TableCell>
                  <TableCell>{product.sku}</TableCell>
                  <TableCell>{quantity}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      </Grid>
    </Grid>
  );
}

export default withStyles(styles)(CustomerOrderDetail);
