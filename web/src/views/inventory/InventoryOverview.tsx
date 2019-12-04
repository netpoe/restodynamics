import { Box, Container, Grid, Paper, TextField, Theme, Typography, withStyles } from "@material-ui/core";
import { Inventory } from "@netpoe/restodynamics-api";
import { History } from "history";
import { DateTime } from "luxon";
import * as math from "mathjs";
import React from "react";
import { RouteComponentProps } from "react-router";
import { Link } from "react-router-dom";
import { useMutation, useQuery } from "urql";
import { Breadcrumbs, Card, CardTitle, DashboardNavigationDrawer, ToolbarPadding } from "../../components";
import { UpdateInventoryUnit } from "../../graphql/mutations";
import { QueryInventory } from "../../graphql/queries";
import { datetime } from "../../utils";
import { routes } from "../routes";

interface IInventoryOverviewProps extends RouteComponentProps<{ id: string }> {
  classes: any;
  history: History;
}

export const InventoryOverview = withStyles((theme: Theme) => ({
  content: {
    flexGrow: 1,
  },
  stockUnitInput: {
    fontSize: theme.typography.h5.fontSize,
    "& input::placeholder": {
      opacity: 1,
    },
  },
}))(({ classes, match, history }: IInventoryOverviewProps) => {
  const [inventoryQuery] = useQuery({
    query: QueryInventory,
    variables: { where: { id: match.params.id || "" } },
  });

  const [updateInventoryUnitMutation, executeUpdateInventoryUnitMutation] = useMutation(
    UpdateInventoryUnit,
  );

  const updateInventoryUnitQuantity = async (
    e: React.ChangeEvent<HTMLInputElement>,
    id: string,
  ) => {
    if (!Boolean(e.target.value)) {
      return;
    }
    try {
      const quantity = Number(e.target.value)
        .toFixed(2)
        .toString();
      await executeUpdateInventoryUnitMutation({
        where: {
          id,
        },
        data: {
          quantity,
        },
      });
    } catch (error) {
      console.error(error);
    }
  };

  const updateInventoryUnitExpenseUnitAmount = async (
    e: React.ChangeEvent<HTMLInputElement>,
    id: string,
  ) => {
    if (!Boolean(e.target.value)) {
      return;
    }
    try {
      const amount = Number(e.target.value)
        .toFixed(2)
        .toString();
      await executeUpdateInventoryUnitMutation({
        where: {
          id,
        },
        data: {
          expenseUnit: {
            update: {
              amount,
            },
          },
        },
      });
    } catch (error) {
      console.error(error);
    }
  };

  const getTotalCosts = (inventoryUnits: any[]) =>
    inventoryUnits
      .reduce(
        (chain: math.MathJsChain, next: any) => chain.add(next.expenseUnit.amount),
        math.chain("0.00"),
      )
      .done().toFixed(2);

  return (
    <Box display="flex">
      <DashboardNavigationDrawer history={history} />
      <Box minHeight="100vh" bgcolor="default" className={classes.content}>
        <ToolbarPadding />
        <Container maxWidth="xl">
          {inventoryQuery.fetching ? (
            <Typography>Cargando</Typography>
          ) : inventoryQuery.error || inventoryQuery.data == null ? (
            <Typography>Error</Typography>
          ) : (
            <Box>
              <Box mb={3}>
                <Breadcrumbs>
                  <Link color="inherit" to={routes.inventory.index}>
                    Inventario
                  </Link>
                  <Typography color="textPrimary">Vista General</Typography>
                  <Typography color="textPrimary">
                    {datetime
                      .locale((inventoryQuery.data.inventory as Inventory).createdAt)
                      .toLocaleString(DateTime.DATE_FULL)}
                  </Typography>
                </Breadcrumbs>
              </Box>
              <Box>
                <Grid container spacing={2}>
                  <Grid item lg={3}>
                    <Card>
                      <CardTitle>Fecha</CardTitle>
                      <Typography
                        variant="h5"
                        color="inherit"
                        style={{ textTransform: "capitalize" }}
                      >
                        {
                          datetime.locale((inventoryQuery.data.inventory as Inventory).createdAt)
                            .weekdayShort
                        }{" "}
                        {datetime
                          .locale((inventoryQuery.data.inventory as Inventory).createdAt)
                          .toLocaleString(DateTime.DATETIME_MED)}
                      </Typography>
                    </Card>
                  </Grid>
                  <Grid item lg={3}>
                    <Card>
                      <CardTitle>Stock</CardTitle>
                      <Typography variant="h5" color="inherit">
                        {inventoryQuery.data.inventory.inventoryUnit.length} unidades
                      </Typography>
                    </Card>
                  </Grid>
                  <Grid item lg={3}>
                    <Card>
                      <CardTitle>Costo Total</CardTitle>
                      <Typography variant="h5" color="inherit">
                        {getTotalCosts(inventoryQuery.data.inventory.inventoryUnit)} GTQ
                      </Typography>
                    </Card>
                  </Grid>
                  <Grid item lg={3}>
                    <Card variant="urgent">
                      <CardTitle>Expiración</CardTitle>
                      <Typography variant="h5" color="inherit">
                        3 unidades vencen pronto
                      </Typography>
                    </Card>
                  </Grid>
                </Grid>
              </Box>
              <Box pt={6}>
                {inventoryQuery.data.inventory.inventoryUnit.map(
                  (inventoryUnit: any, i: number) => (
                    <Box mb={2} key={i}>
                      <Paper>
                        <Grid container spacing={2}>
                          <Grid item lg={5}>
                            <Box
                              px={2}
                              minHeight={56}
                              display="flex"
                              flexDirection="column"
                              justifyContent="center"
                            >
                              <Typography variant="h5" style={{ textTransform: "capitalize" }}>
                                {inventoryUnit.stockUnit.name}
                              </Typography>
                            </Box>
                          </Grid>
                          <Grid item lg={7}>
                            <Box>
                              <Grid container>
                                <Grid item lg={2}>
                                  <Box
                                    px={2}
                                    minHeight={56}
                                    display="flex"
                                    flexDirection="column"
                                    justifyContent="center"
                                  >
                                    <TextField
                                      InputProps={{ className: classes.stockUnitInput }}
                                      fullWidth
                                      onBlur={(e: React.ChangeEvent<HTMLInputElement>) => {
                                        updateInventoryUnitQuantity(e, inventoryUnit.id);
                                      }}
                                      placeholder={inventoryUnit.quantity || "0.00"}
                                    />
                                  </Box>
                                </Grid>
                                <Grid item lg={2}>
                                  <Box
                                    px={2}
                                    minHeight={56}
                                    display="flex"
                                    flexDirection="column"
                                    justifyContent="center"
                                  >
                                    <Typography variant="h5">
                                      {inventoryUnit.unit.symbol}
                                    </Typography>
                                  </Box>
                                </Grid>
                                <Grid item lg={2}>
                                  <Box
                                    px={2}
                                    minHeight={56}
                                    display="flex"
                                    flexDirection="column"
                                    justifyContent="center"
                                  >
                                    <TextField
                                      InputProps={{ className: classes.stockUnitInput }}
                                      fullWidth
                                      onBlur={(e: React.ChangeEvent<HTMLInputElement>) => {
                                        updateInventoryUnitExpenseUnitAmount(e, inventoryUnit.id);
                                      }}
                                      placeholder={inventoryUnit.expenseUnit.amount || "0.00"}
                                    />
                                  </Box>
                                </Grid>
                                <Grid item lg={2}>
                                  <Box
                                    px={2}
                                    minHeight={56}
                                    display="flex"
                                    flexDirection="column"
                                    justifyContent="center"
                                  >
                                    <Typography variant="h5">
                                      {inventoryUnit.expenseUnit.currency.symbol}
                                    </Typography>
                                  </Box>
                                </Grid>
                              </Grid>
                            </Box>
                          </Grid>
                        </Grid>
                      </Paper>
                    </Box>
                  ),
                )}
              </Box>
            </Box>
          )}
        </Container>
      </Box>
    </Box>
  );
});
