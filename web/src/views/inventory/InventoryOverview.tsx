import { Box, Button, Container, Grid, Theme, Typography, withStyles } from "@material-ui/core";
import { History } from "history";
import React from "react";
import { Link } from "react-router-dom";
import {
  Breadcrumbs,
  Card,
  CardTitle,
  DashboardNavigationDrawer,
  ToolbarPadding,
} from "../../components";
import { routes } from "../routes";

export const InventoryOverview = withStyles((theme: Theme) => ({
  root: {
    display: "flex",
  },
  content: {
    flexGrow: 1,
  },
}))(({ classes, history }: { classes: any; history: History }) => {
  return (
    <div className={classes.root}>
      <DashboardNavigationDrawer history={history} />
      <Box minHeight="100vh" bgcolor="default" className={classes.content}>
        <ToolbarPadding />
        <Box mb={3}>
          <Container maxWidth="xl">
            <Breadcrumbs>
              <Link color="inherit" to={routes.inventory.index}>
                Inventario
              </Link>
              <Typography color="textPrimary">Vista General</Typography>
              <Typography color="textPrimary">Agosto 13, 2019</Typography>
            </Breadcrumbs>
          </Container>
        </Box>
        <Container maxWidth="xl">
          <Grid container spacing={2}>
            <Grid item lg={4}>
              <Card actions={<Button size="small">Editar</Button>}>
                <CardTitle>Fecha</CardTitle>
                <Typography variant="h5" color="inherit">
                  Agosto 13, 2019
                </Typography>
              </Card>
            </Grid>
            <Grid item lg={4}>
              <Card actions={<Button size="small">Ver Stock</Button>}>
                <CardTitle>Stock</CardTitle>
                <Typography variant="h5" color="inherit">
                  123 unidades de inventario
                </Typography>
              </Card>
            </Grid>
            <Grid item lg={4}>
              <Card variant="urgent">
                <CardTitle>Expiración</CardTitle>
                <Typography variant="h5" color="inherit">
                  3 unidades vencen pronto
                </Typography>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </div>
  );
});
