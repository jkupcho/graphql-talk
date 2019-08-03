import React from "react";
import Grid from "@material-ui/core/Grid";
import Avatar from "@material-ui/core/Avatar";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import EmailOutlined from "@material-ui/icons/EmailOutlined";
import PhoneOutlined from "@material-ui/icons/PhoneOutlined";
import { withStyles, TableCell, TableBody } from "@material-ui/core";

const styles = theme => ({
  root: {
    flexGrow: 1,
    width: "1280px",
    margin: "0 auto"
  },
  sidebar: {
    padding: "25px 25px"
  },
  avatar: {
    width: 125,
    height: 125,
    margin: "0 auto",
    fontSize: 48,
    marginBottom: 25
  },
  sidebarText: {
    marginTop: 3
  },
  ordersRoot: {
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

const OrderRow = ({ order, classes, onClick }) => {
  const totalPrice = order.lineItems
    .reduce((acc, item) => acc + item.product.retailPrice, 0)
    .toFixed(2);

  const numItems = order.lineItems.reduce(
    (acc, lineItem) => acc + lineItem.quantity,
    0
  );

  return (
    <TableRow className={classes.row} onClick={onClick}>
      <TableCell>{order.id}</TableCell>
      <TableCell>{order.ordered}</TableCell>
      <TableCell>{order.shipped}</TableCell>
      <TableCell>{numItems}</TableCell>
      <TableCell>{totalPrice}</TableCell>
    </TableRow>
  );
};

const Orders = ({ customer, onClick, classes }) => {
  const { orders } = customer;

  const handleClick = order => {
    onClick(order);
  };

  return (
    <Paper className={classes.ordersRoot}>
      <Typography component="h2" variant="h2">
        Orders
      </Typography>
      <Table className={classes.tableRoot}>
        <TableHead>
          <TableRow>
            <TableCell>Order ID</TableCell>
            <TableCell>Ordered</TableCell>
            <TableCell>Shipped</TableCell>
            <TableCell>Num. Items</TableCell>
            <TableCell>Total Price</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {orders.map(order => {
            const orderOnClick = handleClick.bind(this, order);
            return (
              <OrderRow
                key={order.id}
                order={order}
                classes={classes}
                onClick={orderOnClick}
              />
            );
          })}
        </TableBody>
      </Table>
    </Paper>
  );
};

const SideBar = ({ customer, classes }) => {
  const { firstName, lastName, email, phone } = customer;
  return (
    <Paper className={classes.sidebar}>
      <Avatar className={classes.avatar}>
        {firstName.substr(0, 1)}
        {lastName.substr(0, 1)}
      </Avatar>
      <Typography component="h5" variant="h5" gutterBottom>
        {firstName} {lastName}
      </Typography>
      <Grid container>
        <Grid item xs={2}>
          <EmailOutlined />
        </Grid>
        <Grid item xs={10}>
          <Typography
            className={classes.sidebarText}
            variant="caption"
            gutterBottom
          >
            {email}
          </Typography>
        </Grid>
      </Grid>
      <Grid container>
        <Grid item xs={2}>
          <PhoneOutlined />
        </Grid>
        <Grid item xs={10}>
          <Typography
            className={classes.sidebarText}
            variant="caption"
            gutterBottom
          >
            {phone}
          </Typography>
        </Grid>
      </Grid>
    </Paper>
  );
};

const CustomerProfile = ({ customer, handleOrderClick, classes }) => {
  return (
    <Grid container spacing={2} className={classes.root}>
      <Grid item sm={3}>
        <SideBar classes={classes} customer={customer} />
      </Grid>
      <Grid item sm={9}>
        <Orders
          classes={classes}
          customer={customer}
          onClick={handleOrderClick}
        />
      </Grid>
    </Grid>
  );
};

export default withStyles(styles)(CustomerProfile);
