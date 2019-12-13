import LuxonUtils from "@date-io/luxon";
import { DateType } from "@date-io/type";
import {
  AppBar,
  Box,
  Button,
  Container,
  Grid,
  Menu,
  MenuItem,
  Paper,
  TextField,
  Theme,
  Toolbar,
  Typography,
  withStyles,
} from "@material-ui/core";
import { DatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import { MaterialUiPickersDate } from "@material-ui/pickers/typings/date";
import { Inventory, MeasurementUnit } from "@netpoe/restodynamics-api";
import "date-fns";
import { History } from "history";
import { get } from "lodash";
import { DateTime } from "luxon";
import * as math from "mathjs";
import { default as React } from "react";
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
import { UpdateInventory, UpdateInventoryUnit } from "../../graphql/mutations";
import { QueryInventory, QueryStockUnitRelationships } from "../../graphql/queries";
import { styles } from "../../theme";
import { datetime } from "../../utils";
import { routes } from "../routes";
import { LinkStockUnitsToInventoryModal } from "../stock/components";

interface IInventoryOverviewProps extends RouteComponentProps<{ id: string }> {
  classes: any;
  history: History;
}

export const InventoryOverview = withStyles((theme: Theme) => ({
  ...styles(theme),
  stockUnitInput: {
    fontSize: theme.typography.h5.fontSize,
    "& input": {
      fontSize: theme.typography.h5.fontSize,
    },
  },
}))(({ classes, match, history }: IInventoryOverviewProps) => {
  const [inventoryQuery] = useQuery({
    query: QueryInventory,
    variables: { where: { id: match.params.id || "" } },
  });
  const [stockUnitRelationshipsQuery] = useQuery({
    query: QueryStockUnitRelationships,
  });
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
  const [currentInventoryUnitID, setCurrentInventoryUnitID] = React.useState<string | null>(null);
  const [displayLinkStockUnitsModal, setDisplayStockUnitsModal] = React.useState(false);

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

  const updateInventoryUnitMeasurementUnitSymbol = async (
    e: React.MouseEvent<HTMLLIElement, MouseEvent>,
  ) => {
    try {
      const symbol = e.currentTarget.innerText;
      await executeUpdateInventoryUnitMutation({
        where: {
          id: currentInventoryUnitID,
        },
        data: {
          unit: {
            connect: {
              symbol,
            },
          },
        },
      });
      setAnchorEl(null);
    } catch (error) {
      console.error(error);
    }
  };

  const getTotalCosts = (inventoryUnits: any[]) => {
    if (inventoryUnits.length <= 0) {
      return "0.00";
    }
    return inventoryUnits
      .reduce(
        (chain: math.MathJsChain, next: any) => chain.add(next.expenseUnit.amount),
        math.chain("0.00"),
      )
      .done()
      .toFixed(2);
  };

  const measurementUnits = get(stockUnitRelationshipsQuery.data, "measurementUnits", []);

  const [createComponentMutation, executeCreateComponentMutation] = useMutation(UpdateInventory);

  const connectStockUnits = async (stockUnitsIDs: string[]) => {
    try {
      const mutation = (id: string): Promise<any> =>
        new Promise(async (resolve, reject) => {
          const { data, error } = await executeCreateComponentMutation({
            where: {
              id: match.params.id,
            },
            data: {
              inventoryUnits: {
                create: {
                  quantity: "0.00",
                  stockUnit: {
                    connect: {
                      id,
                    },
                  },
                  expenseUnit: {
                    create: {
                      amount: "0.00",
                      stockUnit: {
                        connect: {
                          id,
                        },
                      },
                      currency: {
                        connect: {
                          symbol: "GTQ",
                        },
                      },
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
      await Promise.all(stockUnitsIDs.map((id: string) => mutation(id)));
    } catch (error) {
      console.error(error);
    }
  };

  const handleDateChange = async (
    id: string,
    date: MaterialUiPickersDate | null,
    value?: string | null,
  ) => {
    try {
      const expiresAt = (date as DateType).toISO();
      await executeUpdateInventoryUnitMutation({
        where: {
          id,
        },
        data: {
          expiresAt,
        },
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <MuiPickersUtilsProvider utils={LuxonUtils}>
      <Box display="flex">
        <DashboardNavigationDrawer history={history} />
        <Box minHeight="100vh" bgcolor="default" flexGrow={1} pb={6}>
          <ToolbarPadding />
          {displayLinkStockUnitsModal && (
            <LinkStockUnitsToInventoryModal
              onConnect={connectStockUnits}
              onClose={() => {
                setDisplayStockUnitsModal(false);
              }}
              ids={inventoryQuery.data.inventory.inventoryUnits.map(
                (inventoryUnit: any) => inventoryUnit.stockUnit.id,
              )}
            />
          )}
          <Container maxWidth="xl">
            {inventoryQuery.fetching ? (
              <Typography>Cargando</Typography>
            ) : inventoryQuery.error || inventoryQuery.data == null ? (
              <Typography>Error</Typography>
            ) : (
              <Box>
                <AppBar
                  className={classes.appBar}
                  elevation={0}
                  position="relative"
                  color="default"
                >
                  <Toolbar className={classes.toolbar} disableGutters>
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
                            Agregar unidades
                          </Button>
                        </Grid>
                      </Grid>
                    </Box>
                  </Toolbar>
                </AppBar>
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
                          {inventoryQuery.data.inventory.inventoryUnits.length} unidades
                        </Typography>
                      </Card>
                    </Grid>
                    <Grid item lg={3}>
                      <Card>
                        <CardTitle>Costo Total</CardTitle>
                        <Typography variant="h5" color="inherit">
                          {getTotalCosts(inventoryQuery.data.inventory.inventoryUnits)} GTQ
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
                  <Container maxWidth="xl">
                    <Grid container spacing={2}>
                      <Grid item lg={5}>
                        <Typography variant="overline">Nombre</Typography>
                      </Grid>
                      <Grid item lg={7}>
                        <Box>
                          <Grid container spacing={2}>
                            <Grid item lg={2}>
                              <Typography variant="overline" align="center">
                                Cantidad
                              </Typography>
                            </Grid>
                            <Grid item lg={2}>
                              <Typography variant="overline">Unidad</Typography>
                            </Grid>
                            <Grid item lg={2}>
                              <Typography variant="overline" align="center">
                                Costo
                              </Typography>
                            </Grid>
                            <Grid item lg={2}>
                              <Typography variant="overline" align="center">
                                Divisa
                              </Typography>
                            </Grid>
                            <Grid item lg={4}>
                              <Typography variant="overline">Expiración</Typography>
                            </Grid>
                          </Grid>
                        </Box>
                      </Grid>
                    </Grid>
                  </Container>
                  {inventoryQuery.data.inventory.inventoryUnits.map(
                    (inventoryUnit: any, i: number) => (
                      <Box mb={2} key={i}>
                        <Paper>
                          <Container maxWidth="xl">
                            <Grid container spacing={2}>
                              <Grid item lg={5}>
                                <Box
                                  minHeight={56}
                                  display="flex"
                                  flexDirection="column"
                                  justifyContent="center"
                                >
                                  <Link
                                    to={`${routes.stock.overview}/${inventoryUnit.stockUnit.id}`}
                                  >
                                    <Typography
                                      variant="h5"
                                      style={{ textTransform: "capitalize" }}
                                    >
                                      {inventoryUnit.stockUnit.name}
                                    </Typography>
                                  </Link>
                                </Box>
                              </Grid>
                              <Grid item lg={7}>
                                <Box>
                                  <Grid container spacing={2}>
                                    <Grid item lg={2}>
                                      <Box
                                        minHeight={56}
                                        display="flex"
                                        flexDirection="column"
                                        justifyContent="center"
                                      >
                                        <TextField
                                          InputProps={{
                                            className: `${classes.stockUnitInput} ${classes.stockUnitInputBase}`,
                                          }}
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
                                        minHeight={56}
                                        display="flex"
                                        flexDirection="column"
                                        justifyContent="center"
                                      >
                                        <Typography
                                          variant="h5"
                                          onClick={(
                                            e: React.MouseEvent<HTMLElement, MouseEvent>,
                                          ) => {
                                            setAnchorEl(e.currentTarget);
                                            setCurrentInventoryUnitID(inventoryUnit.id);
                                          }}
                                        >
                                          {inventoryUnit.unit.symbol}
                                        </Typography>
                                        <Menu
                                          id={`inventory-unit-measurement-symbol-${inventoryUnit.id}`}
                                          anchorEl={anchorEl}
                                          keepMounted
                                          open={Boolean(anchorEl)}
                                          onClose={() => {
                                            setAnchorEl(null);
                                          }}
                                        >
                                          {measurementUnits.map(
                                            (unit: MeasurementUnit, i: number) => (
                                              <MenuItem
                                                key={i}
                                                onClick={(
                                                  e: React.MouseEvent<HTMLLIElement, MouseEvent>,
                                                ) => {
                                                  updateInventoryUnitMeasurementUnitSymbol(e);
                                                }}
                                              >
                                                {unit.symbol}
                                              </MenuItem>
                                            ),
                                          )}
                                        </Menu>
                                      </Box>
                                    </Grid>
                                    <Grid item lg={2}>
                                      <Box
                                        minHeight={56}
                                        display="flex"
                                        flexDirection="column"
                                        justifyContent="center"
                                      >
                                        <TextField
                                          InputProps={{
                                            className: `${classes.stockUnitInput} ${classes.stockUnitInputBase}`,
                                          }}
                                          fullWidth
                                          onBlur={(e: React.ChangeEvent<HTMLInputElement>) => {
                                            updateInventoryUnitExpenseUnitAmount(
                                              e,
                                              inventoryUnit.id,
                                            );
                                          }}
                                          placeholder={inventoryUnit.expenseUnit.amount || "0.00"}
                                        />
                                      </Box>
                                    </Grid>
                                    <Grid item lg={2}>
                                      <Box
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
                                    <Grid item lg={4}>
                                      <Box
                                        minHeight={56}
                                        display="flex"
                                        flexDirection="column"
                                        justifyContent="center"
                                      >
                                        <DatePicker
                                          disablePast
                                          variant="inline"
                                          value={inventoryUnit.expiresAt || new Date()}
                                          format="yyyy-MM-dd"
                                          className={classes.stockUnitInput}
                                          onChange={(
                                            date: MaterialUiPickersDate | null,
                                            value?: string | null,
                                          ) => {
                                            handleDateChange(inventoryUnit.id, date, value);
                                          }}
                                        />
                                      </Box>
                                    </Grid>
                                  </Grid>
                                </Box>
                              </Grid>
                            </Grid>
                          </Container>
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
    </MuiPickersUtilsProvider>
  );
});
