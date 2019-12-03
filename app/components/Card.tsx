import { Card as MUICard, CardActions, CardContent, Theme, Typography } from "@material-ui/core";
import { CardProps } from "@material-ui/core/Card";
import { withStyles } from "@material-ui/styles";
import React from "react";

interface ICardProps extends CardProps {
  classes: any;
  children: any;
  actions?: any;
  variant?: "urgent";
}

export const Card = withStyles((theme: Theme) => ({
  card: {
    minHeight: 140,
    "&.urgent": {
      backgroundColor: theme.palette.error.main,
      color: "white",
      "& .card-title": {
        color: "inherit",
      },
    },
    "& .card-title": {
      color: theme.palette.text.secondary,
    },
  },
}))(({ classes, children, actions, variant, ...rest }: ICardProps) => (
  <MUICard className={`${classes.card} ${variant}`} {...rest}>
    <CardContent>{children}</CardContent>
    <CardActions>{actions}</CardActions>
  </MUICard>
));

export const CardTitle = withStyles((theme: Theme) => ({}))(
  ({ classes, children }: { classes: any; children: any }) => (
    <Typography variant="overline" color="inherit" gutterBottom className={`card-title`}>
      {children}
    </Typography>
  ),
);
