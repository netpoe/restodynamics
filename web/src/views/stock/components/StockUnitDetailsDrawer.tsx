import {
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Theme,
} from "@material-ui/core";
import ArrowBackOutlinedIcon from "@material-ui/icons/ArrowBackOutlined";
import AttachMoneyOutlinedIcon from "@material-ui/icons/AttachMoneyOutlined";
import DashboardOutlinedIcon from "@material-ui/icons/DashboardOutlined";
import GroupOutlinedIcon from "@material-ui/icons/GroupOutlined";
import ListOutlinedIcon from "@material-ui/icons/ListOutlined";
import TimelapseOutlinedIcon from "@material-ui/icons/TimelapseOutlined";
import { withStyles } from "@material-ui/styles";
import React from "react";

const drawerWidth = 240;

export const StockUnitDetailsDrawer = withStyles((theme: Theme) => ({
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  toolbar: theme.mixins.toolbar,
}))(({ classes }: { classes: any }) => (
  <Drawer
    className={classes.drawer}
    variant="permanent"
    classes={{
      paper: classes.drawerPaper,
    }}
  >
    <div className={classes.toolbar} />
    <List>
      <ListItem button>
        <ListItemIcon>
          <DashboardOutlinedIcon />
        </ListItemIcon>
        <ListItemText primary="Vista General" />
      </ListItem>
      <ListItem button>
        <ListItemIcon>
          <ListOutlinedIcon />
        </ListItemIcon>
        <ListItemText primary="Detalles" />
      </ListItem>
      <ListItem button>
        <ListItemIcon>
          <TimelapseOutlinedIcon />
        </ListItemIcon>
        <ListItemText primary="Inventario" />
      </ListItem>
      <ListItem button>
        <ListItemIcon>
          <AttachMoneyOutlinedIcon />
        </ListItemIcon>
        <ListItemText primary="Costos" />
      </ListItem>
      <ListItem button>
        <ListItemIcon>
          <GroupOutlinedIcon />
        </ListItemIcon>
        <ListItemText primary="Proveedores" />
      </ListItem>
    </List>
    <Divider />
    <List>
      <ListItem button>
        <ListItemIcon>
          <ArrowBackOutlinedIcon />
        </ListItemIcon>
        <ListItemText primary="Volver" />
      </ListItem>
    </List>
  </Drawer>
));
