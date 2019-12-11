import { AppBar, Box, Button, Chip, Container, Grid, TableCell, Theme, Toolbar, Typography, withStyles } from "@material-ui/core";
import { StockUnit } from "@netpoe/restodynamics-api";
import { History } from "history";
import { first, get } from "lodash";
import { DateTime as LuxonDateTime } from "luxon";
import React from "react";
import { Link } from "react-router-dom";
import { useMutation, useQuery } from "urql";
import { Breadcrumbs, Card, CardTitle, DashboardNavigationDrawer, drawerWidth, ToolbarPadding } from "../../components";
import { CreateInventory, CreateInventoryUnit } from "../../graphql/mutations";
import { QueryStockUnits } from "../../graphql/queries";
import { styles } from "../../theme";
import { datetime } from "../../utils";
import { routes } from "../routes";

export const StockUnitIndex = withStyles((theme: Theme) => ({
  ...styles(theme),
  content: {
    flexGrow: 1,
    position: "relative",
  },
  newInventoryCollection: {
    backgroundColor: theme.palette.primary.main,
    width: "100%",
    position: "fixed",
    bottom: 0,
    left: 0,
    right: 0,
    paddingLeft: drawerWidth,
  },
  selectedStockUnit: {
    border: `2px solid ${theme.palette.primary.main}`,
  },
  selectedStockUnitCard: {
    minHeight: "auto",
  },
}))(({ classes, history }: { classes: any; history: History }) => {
  const [isNewInventory, setIsNewInventory] = React.useState(false);
  const [selectedStockUnitsIds, setSelectedStockUnits] = React.useState<string[]>([]);
  const [stockUnitsQuery] = useQuery({
    query: QueryStockUnits,
  });
  const [createInventoryUnitMutation, executeCreateInventoryUnitMutation] = useMutation(
    CreateInventoryUnit,
  );
  const [createInventoryMutation, executeCreateInventoryMutation] = useMutation(CreateInventory);

  const handleOnTableRowClick = (e: any, id: string) => {
    if (isNewInventory) {
      if (selectedStockUnitsIds.includes(id)) {
        selectedStockUnitsIds.splice(selectedStockUnitsIds.indexOf(id), 1);
        setSelectedStockUnits([...selectedStockUnitsIds]);
      } else {
        setSelectedStockUnits([...selectedStockUnitsIds, id]);
      }
    } else {
      history.push(`${routes.stock.overview}/${id}`);
    }
  };

  const onCreateInventory = async () => {
    const { data, error } = await executeCreateInventoryMutation();
    console.log(data, error);
    const {
      createInventory: { id: inventoryID },
    } = data;
    const mutation = (id: string) =>
      new Promise(async (resolve, reject) => {
        const { data, error } = await executeCreateInventoryUnitMutation({
          data: {
            inventory: {
              connect: {
                id: inventoryID,
              },
            },
            unit: {
              connect: {
                symbol: "U",
              },
            },
            expenseUnit: {
              create: {
                currency: {
                  connect: {
                    symbol: "GTQ",
                  },
                },
                stockUnit: {
                  connect: {
                    id,
                  },
                },
              },
            },
            stockUnit: {
              connect: {
                id,
              },
            },
          },
        });

        resolve(data);
      });

    try {
      await Promise.all(selectedStockUnitsIds.map((id: string) => mutation(id)));
      history.push(`${routes.inventory.overview}/${inventoryID}`);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Box display="flex">
      <DashboardNavigationDrawer history={history} />
      <Box minHeight="200vh" bgcolor="default" className={classes.content}>
        <ToolbarPadding />
        <Container maxWidth="xl">
          {stockUnitsQuery.fetching ? (
            <Typography>Cargando</Typography>
          ) : stockUnitsQuery.error || stockUnitsQuery.data == null ? (
            <Typography>Error</Typography>
          ) : (
            <Box>
              <AppBar className={classes.appBar} elevation={0} position="relative" color="default">
                <Toolbar className={classes.toolbar} disableGutters>
                  <Breadcrumbs>
                    <Link color="inherit" to={routes.stock.index}>
                      Inicio
                    </Link>
                    <Typography color="textPrimary">Stock</Typography>
                  </Breadcrumbs>
                  <Box>
                    <Grid container spacing={2}>
                      <Grid item>
                        <Link to={routes.stock.bulkImport}>
                          <Button size="large" variant="outlined" color="default">
                            Importar en grupo
                          </Button>
                        </Link>
                      </Grid>
                      <Grid item>
                        <Button
                          size="large"
                          variant="outlined"
                          color="default"
                          onClick={() => setIsNewInventory(true)}
                        >
                          Nuevo inventario
                        </Button>
                      </Grid>
                      <Grid item>
                        <Link to={routes.stock.overview}>
                          <Button size="large" variant="contained" color="primary">
                            Nuevo artículo
                          </Button>
                        </Link>
                      </Grid>
                    </Grid>
                  </Box>
                </Toolbar>
              </AppBar>
              <Grid container spacing={2}>
                {stockUnitsQuery.data.stockUnits.map((stockUnit: any, i: number) => (
                  <Grid item lg={4} key={i}>
                    <Card
                      onClick={(e: any) => handleOnTableRowClick(e, stockUnit.id)}
                      id={stockUnit.id}
                      className={
                        selectedStockUnitsIds.includes(stockUnit.id)
                          ? classes.selectedStockUnit
                          : ""
                      }
                    >
                      <CardTitle>{get(stockUnit, "category.name", null)}</CardTitle>
                      <Typography
                        variant="h5"
                        color="inherit"
                        style={{ textTransform: "capitalize" }}
                      >
                        {stockUnit.name}
                      </Typography>
                      {get(first(stockUnit.inventory), "quantity", null) &&
                        get(first(stockUnit.inventory), "unit.symbol", null) &&
                        get(first(stockUnit.inventory), "createdAt", "") && (
                          <Typography variant="body1" color="inherit">
                            {get(first(stockUnit.inventory), "quantity", null)}
                            {get(first(stockUnit.inventory), "unit.symbol", null)}.
                            <Typography variant="body2" component="span">
                              {" el "}
                              {datetime
                                .locale(get(first(stockUnit.inventory), "createdAt", ""))
                                .toLocaleString(LuxonDateTime.DATE_HUGE)}
                            </Typography>
                          </Typography>
                        )}
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}
        </Container>
        {isNewInventory && (
          <Box className={classes.newInventoryCollection}>
            <Container maxWidth="xl">
              <Grid container spacing={2}>
                <Grid item lg={9}>
                  <Box py={2}>
                    <Typography variant="h5" color="textSecondary">
                      Nuevo inventario:{" "}
                    </Typography>
                    <Typography color="textSecondary">
                      Selecciona los artículos que desees agregar al inventario
                    </Typography>
                  </Box>
                  <Box pb={2}>
                      {selectedStockUnitsIds.map((id, i: number) => (
                        <Chip key={i} label={(first(
                          stockUnitsQuery.data.stockUnits.filter(
                            (stockUnit: StockUnit) => stockUnit.id === id,
                          ) as StockUnit[],
                        ) as StockUnit).name} style={{ textTransform: "capitalize" }} />
                      ))}
                  </Box>
                </Grid>
                <Grid item lg={3}>
                  <Box minHeight="25vh" py={2}>
                    <Grid container spacing={2}>
                      <Grid item>
                        <Button
                          variant="outlined"
                          color="secondary"
                          onClick={() => setIsNewInventory(false)}
                        >
                          Cancelar
                        </Button>
                      </Grid>
                      <Grid item>
                        <Button
                          variant="contained"
                          color="default"
                          onClick={() => onCreateInventory()}
                        >
                          Crear
                        </Button>
                      </Grid>
                    </Grid>
                  </Box>
                </Grid>
              </Grid>
            </Container>
          </Box>
        )}
      </Box>
    </Box>
  );
});

const StyledTableCell = withStyles(theme => ({
  head: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
    ...theme.typography.body1,
    fontWeight: 600,
  },
}))(TableCell);
