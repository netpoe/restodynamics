import {
  AppBar,
  Box,
  Button,
  Container,
  Grid,
  Theme,
  Toolbar,
  Tooltip,
  Typography,
  withStyles,
} from "@material-ui/core";
import HelpOutlineOutlinedIcon from "@material-ui/icons/HelpOutlineOutlined";
import { Component } from "@netpoe/restodynamics-api";
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
import {
  getComponentAsMathUnit,
  getComponentCostByMeasurementUnit,
  getComponentInventoryUnitAsMathUnit,
} from "../../utils";
import { routes } from "../routes";
import {
  LinkStockUnitsModal,
  StockUnitChildComponents,
  StockUnitDetailsDrawer,
} from "./components";

interface IStockUnitComponentsProps extends RouteComponentProps<{ id: string }> {
  classes: any;
}

export const StockUnitComponents = withStyles((theme: Theme) => ({
  ...styles(theme),
}))(({ classes, match, history, ...props }: IStockUnitComponentsProps) => {
  const [stockUnitDetailsQuery] = useQuery({
    query: QueryStockUnit,
    requestPolicy: "network-only",
    variables: {
      where: { id: match.params.id || "" },
      componentInventoryUnitStockUnitInventoryUnitWhere: {
        expenseUnit: {
          amount_gte: "0.00",
        },
      },
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
    if (components.length <= 0) {
      return "0.00";
    }
    return math.round(
      components
        .reduce((chain: math.MathJsChain, component: any) => {
          const inventoryUnit = component.inventoryUnit.stockUnit.inventoryUnits[0];
          if (Boolean(inventoryUnit)) {
            return chain.add(getComponentCostByMeasurementUnit(component));
          }
          return chain.add(0);
        }, math.chain("0.00"))
        .done(),
      4,
    );
  };

  const getEstimatedProductionUnits = () => {
    const components = stockUnitDetailsQuery.data.stockUnit.components;
    if (components.length <= 0) {
      return "0.00";
    }
    return (components.map((component: any) => {
      const inventoryUnit = component.inventoryUnit.stockUnit.inventoryUnits[0];
      if (Boolean(inventoryUnit)) {
        const quantity = math.divide(
          getComponentInventoryUnitAsMathUnit(component),
          getComponentAsMathUnit(component),
        ); // this may return a Unit when units' taxonomy do not match
        return typeof quantity === "object" ? 0 : quantity;
      }
    }) as number[])
      .sort((a, b) => a - b)[0]
      .toFixed(2);
  };

  return (
    <Box display="flex">
      <DashboardNavigationDrawer history={history} />
      <StockUnitDetailsDrawer match={match} history={history} {...props} />
      <Box minHeight="100vh" bgcolor="default" flexGrow={1} pb={6}>
        <ToolbarPadding />
        {displayLinkStockUnitsModal && (
          <LinkStockUnitsModal
            onConnect={connectStockUnits}
            onClose={() => {
              setDisplayStockUnitsModal(false);
            }}
            ids={[
              match.params.id,
              ...stockUnitDetailsQuery.data.stockUnit.components.map(
                (component: any) => component.inventoryUnit.stockUnit.id,
              ),
            ]}
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
                          Agregar componentes
                        </Button>
                      </Grid>
                    </Grid>
                  </Box>
                </Toolbar>
              </AppBar>
              <Grid container spacing={2}>
                <Grid item lg={4}>
                  <Card>
                    <CardTitle>
                      Costo estimado
                      <Tooltip
                        title="Suma total del costo de cada componente en relación a su último inventario."
                        placement="right"
                      >
                        <HelpOutlineOutlinedIcon style={{ fontSize: "0.9rem" }} />
                      </Tooltip>
                    </CardTitle>
                    <Typography
                      variant="h5"
                      color="inherit"
                      style={{ textTransform: "capitalize" }}
                    >
                      {getEstimatedCost()} GTQ
                    </Typography>
                  </Card>
                </Grid>
                <Grid item lg={4}>
                  <Card actions={<Button size="small">Agregar a inventario</Button>}>
                    <CardTitle>
                      Porciones estimadas
                      <Tooltip
                        title="Número de unidades que se pueden producir según el último inventario de cada uno de los componentes."
                        placement="right"
                      >
                        <HelpOutlineOutlinedIcon style={{ fontSize: "0.9rem" }} />
                      </Tooltip>
                    </CardTitle>
                    <Typography
                      variant="h5"
                      color="inherit"
                      style={{ textTransform: "capitalize" }}
                    >
                      {getEstimatedProductionUnits()}
                    </Typography>
                  </Card>
                </Grid>
              </Grid>
              <Box mt={2}>
                <Container maxWidth="xl">
                  <Grid container spacing={2}>
                    <Grid item lg={5} sm={4}>
                      <Typography variant="overline">Nombre</Typography>
                    </Grid>
                    <Grid item lg={7} sm={8}>
                      <Box>
                        <Grid container spacing={2}>
                          <Grid item lg={2} sm={2}>
                            <Typography variant="overline">Cantidad</Typography>
                          </Grid>
                          <Grid item lg={2} sm={2}>
                            <Typography variant="overline">Unidad</Typography>
                          </Grid>
                          <Grid item lg={2} sm={2} style={{ textAlign: "right" }}>
                            <Typography variant="overline">Costo</Typography>
                          </Grid>
                          <Grid item lg={2} sm={2}>
                            <Typography variant="overline">Divisa</Typography>
                          </Grid>
                          <Grid item lg={4} sm={4}>
                            <Typography variant="overline">Expiración</Typography>
                          </Grid>
                        </Grid>
                      </Box>
                    </Grid>
                  </Grid>
                </Container>
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
