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
import CategoryOutlinedIcon from "@material-ui/icons/CategoryOutlined";
import HomeOutlinedIcon from "@material-ui/icons/HomeOutlined";
import { withStyles } from "@material-ui/styles";
import { useRouter } from "next/router";
import React from "react";
import { ToolbarPadding } from "./ToolbarPadding";

const drawerWidth = 59;

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
}))(({ classes }: { classes: any }) => {
  const router = useRouter();

  const onClick = (e, href: string) => {
    e.preventDefault();
    router.push(href);
  };

  return (
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
          onClick={e => {
            onClick(e, `/inventory`);
          }}
        >
          <ListItemIcon>
            <CategoryOutlinedIcon />
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
  );
});
