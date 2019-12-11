import {
  AppBar,
  Box,
  Button,
  Container,
  Grid,
  Theme,
  Toolbar,
  Typography,
  withStyles,
} from "@material-ui/core";
import { Component } from "@netpoe/restodynamics-api";
import { History } from "history";
import * as math from "mathjs";
import React from "react";
import { RouteComponentProps } from "react-router";
import { Link } from "react-router-dom";
import { useMutation, useQuery } from "urql";
import {
  Breadcrumbs,
  Card,
  CardTitle,
  DashboardNavigationDrawer,
  ToolbarPadding,
} from "../../components";
import { CreateComponent } from "../../graphql/mutations";
import { QueryStockUnit } from "../../graphql/queries";
import { styles } from "../../theme";
import { routes } from "../routes";
import {
  LinkStockUnitsModal,
  StockUnitChildComponents,
  StockUnitDetailsDrawer,
} from "./components";

interface IStockUnitComponentsProps extends RouteComponentProps<{ id: string }> {
  classes: any;
  history: History;
}

export const StockUnitComponents = withStyles((theme: Theme) => ({
  ...styles(theme),
}))(({ classes, match, history }: IStockUnitComponentsProps) => {
  const [stockUnitDetailsQuery] = useQuery({
    query: QueryStockUnit,
    variables: {
      where: { id: match.params.id || "" },
      componentInventoryUnitStockUnitInventoryUnitOrderBy: "createdAt_DESC",
      componentInventoryUnitStockUnitInventoryUnitFirst: 1,
    },
  });

  const [createComponentMutation, executeCreateComponentMutation] = useMutation(CreateComponent);

  const connectStockUnits = async (componentsIDs: string[]) => {
    try {
      const mutation = (id: string): Promise<Component> =>
        new Promise(async (resolve, reject) => {
          const { data, error } = await executeCreateComponentMutation({
            data: {
              stockUnit: {
                connect: {
                  id: match.params.id,
                },
              },
              inventoryUnit: {
                create: {
                  stockUnit: {
                    connect: {
                      id,
                    },
                  },
                  unit: {
                    connect: {
                      symbol: "U",
                    },
                  },
                },
              },
            },
          });
          resolve();
        });
      await Promise.all(componentsIDs.map((id: string) => mutation(id)));
    } catch (error) {
      console.error(error);
    }
  };

  const [displayLinkStockUnitsModal, setDisplayStockUnitsModal] = React.useState(false);

  const getEstimatedCost = () => {
    const components = stockUnitDetailsQuery.data.stockUnit.components;
    return components
      .reduce((chain: math.MathJsChain, component: any) => {
        if (Boolean(component.inventoryUnit.stockUnit.inventoryUnits[0])) {
          return chain.add(component.inventoryUnit.stockUnit.inventoryUnits[0].expenseUnit.amount);
        }
        return chain.add(0);
      }, math.chain("0.00"))
      .done()
      .toFixed(2);
  };

  return (
    <Box display="flex">
      <DashboardNavigationDrawer history={history} />
      <StockUnitDetailsDrawer history={history} />
      <Box minHeight="100vh" bgcolor="default" flexGrow={1}>
        <ToolbarPadding />
        {displayLinkStockUnitsModal && (
          <LinkStockUnitsModal
            onConnect={connectStockUnits}
            onClose={() => {
              setDisplayStockUnitsModal(false);
            }}
            id={match.params.id}
          />
        )}
        <Container maxWidth="xl">
          {stockUnitDetailsQuery.fetching ? (
            <Typography>Cargando</Typography>
          ) : stockUnitDetailsQuery.error || stockUnitDetailsQuery.data == null ? (
            <Typography>Error</Typography>
          ) : (
            <Box>
              <AppBar className={classes.appBar} elevation={0} position="relative" color="default">
                <Toolbar className={classes.toolbar} disableGutters>
                  <Breadcrumbs>
                    <Link color="inherit" to={routes.stock.index}>
                      Stock
                    </Link>
                    <Typography color="textPrimary">Componentes</Typography>
                    <Typography color="textPrimary" style={{ textTransform: "capitalize" }}>
                      {stockUnitDetailsQuery.data.stockUnit.name}
                    </Typography>
                  </Breadcrumbs>
                  <Box>
                    <Grid container spacing={2}>
                      <Grid item>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => {
                            setDisplayStockUnitsModal(true);
                          }}
                        >
                          Vincular
                        </Button>
                      </Grid>
                    </Grid>
                  </Box>
                </Toolbar>
              </AppBar>
              <Grid container spacing={2}>
                <Grid item lg={4}>
                  <Card>
                    <CardTitle>Costo estimado</CardTitle>
                    <Typography
                      variant="h5"
                      color="inherit"
                      style={{ textTransform: "capitalize" }}
                    >
                      {getEstimatedCost()}
                    </Typography>
                  </Card>
                </Grid>
              </Grid>
              <Box mt={2}>
                <Box mb={2}>
                  <Typography variant="overline">Se conforma de estos componentes</Typography>
                </Box>
                <StockUnitChildComponents
                  components={stockUnitDetailsQuery.data.stockUnit.components}
                />
              </Box>
            </Box>
          )}
        </Container>
      </Box>
    </Box>
  );
});
