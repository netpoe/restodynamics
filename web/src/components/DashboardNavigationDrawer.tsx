import { Divider, Drawer, List, ListItem, ListItemIcon, ListItemText, Theme } from "@material-ui/core";
import ArrowBackOutlinedIcon from "@material-ui/icons/ArrowBackOutlined";
import CategoryOutlinedIcon from "@material-ui/icons/CategoryOutlined";
import HomeOutlinedIcon from "@material-ui/icons/HomeOutlined";
import TimelapseOutlinedIcon from "@material-ui/icons/TimelapseOutlined";
import { withStyles } from "@material-ui/styles";
import { History } from "history";
import React from "react";
import { routes } from "../views/routes";
import { ToolbarPadding } from "./ToolbarPadding";

export const drawerWidth = 59;

export const DashboardNavigationDrawer = withStyles((theme: Theme) => ({
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
    backgroundColor: theme.palette.primary.light,
    color: "white",
    "& svg": {
      color: "white",
    },
  },
}))(({ classes, history }: { classes: any; history: History }) => (
  <Drawer
    className={classes.drawer}
    variant="permanent"
    classes={{
      paper: classes.drawerPaper,
    }}
  >
    <ToolbarPadding />
    <List>
      <ListItem button>
        <ListItemIcon>
          <HomeOutlinedIcon />
        </ListItemIcon>
        <ListItemText primary="Inicio" />
      </ListItem>
      <ListItem
        button
        onClick={() => {
          history.push(`${routes.stock.index}`);
        }}
      >
        <ListItemIcon>
          <CategoryOutlinedIcon />
        </ListItemIcon>
        <ListItemText primary="Stock" />
      </ListItem>
      <ListItem
        button
        onClick={() => {
          history.push(`${routes.inventory.index}`);
        }}
      >
        <ListItemIcon>
          <TimelapseOutlinedIcon />
        </ListItemIcon>
        <ListItemText primary="Inventario" />
      </ListItem>
    </List>
    <Divider />
    <List>
      <ListItem button>
        <ListItemIcon>
          <ArrowBackOutlinedIcon />
        </ListItemIcon>
        <ListItemText primary="Salir" />
      </ListItem>
    </List>
  </Drawer>
));
