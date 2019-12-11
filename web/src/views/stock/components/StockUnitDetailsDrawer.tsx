import { Divider, Drawer, List, ListItem, ListItemIcon, ListItemText, Theme } from "@material-ui/core";
import ArrowBackOutlinedIcon from "@material-ui/icons/ArrowBackOutlined";
import AttachMoneyOutlinedIcon from "@material-ui/icons/AttachMoneyOutlined";
import DashboardOutlinedIcon from "@material-ui/icons/DashboardOutlined";
import DonutLargeOutlinedIcon from '@material-ui/icons/DonutLargeOutlined';
import GroupOutlinedIcon from "@material-ui/icons/GroupOutlined";
import ListOutlinedIcon from "@material-ui/icons/ListOutlined";
import TimelapseOutlinedIcon from "@material-ui/icons/TimelapseOutlined";
import { withStyles } from "@material-ui/styles";
import { History } from "history";
import React from "react";
import { routes } from "../../routes";

const drawerWidth = 240;

export const StockUnitDetailsDrawer = withStyles((theme: Theme) => ({
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
    left: "inherit",
  },
  toolbar: theme.mixins.toolbar,
}))(({ classes, history }: { classes: any; history: History }) => {

  const isSelected = (route: string): boolean => {
    const regexp = new RegExp(route, "gi");
    return regexp.test(history.location.pathname);
  };

  return (

  <Drawer
    className={classes.drawer}
    variant="permanent"
    classes={{
      paper: classes.drawerPaper,
    }}
  >
    <div className={classes.toolbar} />
    <List>
      <ListItem button selected={isSelected(routes.stock.overview)}>
        <ListItemIcon>
          <DashboardOutlinedIcon />
        </ListItemIcon>
        <ListItemText primary="Vista General" />
      </ListItem>
      <ListItem button selected={isSelected(routes.stock.components)}>
        <ListItemIcon>
          <DonutLargeOutlinedIcon />
        </ListItemIcon>
        <ListItemText primary="Componentes" />
      </ListItem>
      <ListItem button selected={isSelected(routes.stock.details)}>
        <ListItemIcon>
          <ListOutlinedIcon />
        </ListItemIcon>
        <ListItemText primary="Detalles" />
      </ListItem>
      <ListItem button selected={isSelected(routes.stock.inventory)}>
        <ListItemIcon>
          <TimelapseOutlinedIcon />
        </ListItemIcon>
        <ListItemText primary="Inventario" />
      </ListItem>
      <ListItem button selected={isSelected(routes.stock.costs)}>
        <ListItemIcon>
          <AttachMoneyOutlinedIcon />
        </ListItemIcon>
        <ListItemText primary="Costos" />
      </ListItem>
      <ListItem button selected={isSelected(routes.stock.suppliers)}>
        <ListItemIcon>
          <GroupOutlinedIcon />
        </ListItemIcon>
        <ListItemText primary="Proveedores" />
      </ListItem>
    </List>
    <Divider />
    <List>
      <ListItem
        button
        onClick={() => {
          history.push(`${routes.stock.index}`);
        }}
      >
        <ListItemIcon>
          <ArrowBackOutlinedIcon />
        </ListItemIcon>
        <ListItemText primary="Volver" />
      </ListItem>
    </List>
  </Drawer>
  );
});
