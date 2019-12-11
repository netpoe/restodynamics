import { Box, Button, Container, Grid, Theme, Typography, withStyles } from "@material-ui/core";
import { Component } from "@netpoe/restodynamics-api";
import { History } from "history";
import { get } from "lodash";
import React from "react";
import { RouteComponentProps } from "react-router";
import { Link } from "react-router-dom";
import { useMutation, useQuery } from "urql";
import { Breadcrumbs, Card, CardTitle, DashboardNavigationDrawer, ToolbarPadding } from "../../components";
import { CreateComponent } from "../../graphql/mutations";
import { QueryStockUnit } from "../../graphql/queries";
import { routes } from "../routes";
import { LinkStockUnitsModal, StockUnitDetailsDrawer, StockUnitNameField, StockUnitParentComponents } from "./components";

interface IStockUnitDetailsProps extends RouteComponentProps<{ id: string }> {
  classes: any;
  history: History;
}

export const StockUnitOverview = withStyles((theme: Theme) => ({
  
}))(({ classes, match, history }: IStockUnitDetailsProps) => {
  const [stockUnitDetailsQuery] = useQuery({
    query: QueryStockUnit,
    variables: { where: { id: match.params.id || "" } },
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
              <Box mb={3}>
                <Breadcrumbs>
                  <Link color="inherit" to={routes.stock.index}>
                    Stock
                  </Link>
                  <Typography color="textPrimary">Vista General</Typography>
                  <Typography color="textPrimary" style={{ textTransform: "capitalize" }}>
                    {match.params.id
                      ? `${stockUnitDetailsQuery.data.stockUnit.name}`
                      : "Nueva Unidad de Inventario"}
                  </Typography>
                </Breadcrumbs>
              </Box>
              <Box mb={3}>
                <StockUnitNameField
                  id={get(stockUnitDetailsQuery.data.stockUnit, ["id"], "")}
                  value={get(stockUnitDetailsQuery.data.stockUnit, ["name"], "")}
                />
              </Box>
              <Grid container spacing={2}>
                <Grid item lg={4}>
                  <Card actions={<Button size="small">Editar</Button>}>
                    <CardTitle>Categoría</CardTitle>
                    <Typography
                      variant="h5"
                      color="inherit"
                      style={{ textTransform: "capitalize" }}
                    >
                      {get(stockUnitDetailsQuery.data.stockUnit, "category.name", "")}
                    </Typography>
                  </Card>
                </Grid>
                <Grid item lg={4}>
                  <Card
                    actions={
                      <Button size="small" color="inherit">
                        Inventario
                      </Button>
                    }
                  >
                    <CardTitle>Cantidad disponible</CardTitle>
                    <Typography variant="h5" color="inherit">
                      3 libras
                    </Typography>
                  </Card>
                </Grid>
                <Grid item lg={4}>
                  <Card
                    variant="urgent"
                    actions={
                      <Button size="small" color="inherit">
                        Inventario
                      </Button>
                    }
                  >
                    <CardTitle>Expira en</CardTitle>
                    <Typography variant="h5" color="inherit">
                      5 días
                    </Typography>
                  </Card>
                </Grid>
              </Grid>
              <Box mt={2}>
                <Grid container spacing={2}>
                  <Grid item lg={6}>
                    <Card>
                      <CardTitle
                        actions={
                          <Box>
                            <Grid container>
                              <Grid item>
                                <Button
                                  variant="text"
                                  size="small"
                                  onClick={() => {
                                    history.push(`${routes.stock.components}/${match.params.id}`);
                                  }}
                                >
                                  Componentes
                                </Button>
                              </Grid>
                            </Grid>
                          </Box>
                        }
                      >
                        Se conforma de estos componentes
                      </CardTitle>
                      <Box mt={1}>
                      {stockUnitDetailsQuery.data.stockUnit.components.map(
                        (component: any, i: number) => (
                          <Grid container key={i} spacing={1}>
                            <Grid item lg={8}>
                              <Box
                                minHeight={28}
                                display="flex"
                                flexDirection="column"
                                justifyContent="center"
                              >
                                <Link
                                  to={`${routes.stock.overview}/${component.inventoryUnit.stockUnit.id}`}
                                >
                                  <Typography style={{ textTransform: "capitalize" }}>
                                    {component.inventoryUnit.stockUnit.name}
                                  </Typography>
                                </Link>
                              </Box>
                            </Grid>
                            <Grid item lg={2}>
                              <Box
                                minHeight={28}
                                display="flex"
                                flexDirection="column"
                                justifyContent="center"
                                textAlign="right"
                              >
                                <Typography style={{ textTransform: "capitalize" }}>
                                  {component.inventoryUnit.quantity || "0.00"}
                                </Typography>
                              </Box>
                            </Grid>
                            <Grid item lg={2}>
                              <Box
                                minHeight={28}
                                display="flex"
                                flexDirection="column"
                                justifyContent="center"
                                textAlign="right"
                              >
                                <Typography>{component.inventoryUnit.unit.symbol}</Typography>
                              </Box>
                            </Grid>
                          </Grid>
                        ),
                      )}
                      </Box>
                    </Card>
                  </Grid>
                  <Grid item lg={6}>
                    <Card>
                      <CardTitle>Se utiliza en estas unidades</CardTitle>
                      {stockUnitDetailsQuery.data.stockUnit && (
                        <StockUnitParentComponents id={match.params.id} />
                      )}
                    </Card>
                  </Grid>
                </Grid>
              </Box>
            </Box>
          )}
        </Container>
      </Box>
    </Box>
  );
});
