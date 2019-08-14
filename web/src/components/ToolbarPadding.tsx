import { Theme } from "@material-ui/core";
import { withStyles } from "@material-ui/styles";
import React from "react";

export const ToolbarPadding = withStyles((theme: Theme) => ({
  toolbar: theme.mixins.toolbar,
}))(({ classes }: { classes: any }) => <div className={classes.toolbar} />);
