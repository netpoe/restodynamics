import { Breadcrumbs as MUIBreadcrumbs, Paper, Theme } from "@material-ui/core";
import { withStyles } from "@material-ui/styles";
import React from "react";

export const Breadcrumbs = withStyles((theme: Theme) => ({
  paper: {
    padding: theme.spacing(1, 2),
    width: "fit-content",
  },
}))(({ classes, children }: { classes: any; children: any }) => (
  <Paper elevation={1} className={classes.paper}>
    <MUIBreadcrumbs aria-label="breadcrumb">{children}</MUIBreadcrumbs>
  </Paper>
));
