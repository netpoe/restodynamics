import LuxonUtils from "@date-io/luxon";
import { DateType } from "@date-io/type";
import { AppBar, Box, Container, Grid, Menu, MenuItem, Paper, TextField, Theme, Toolbar, Typography, withStyles } from "@material-ui/core";
import { DatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import { MaterialUiPickersDate } from "@material-ui/pickers/typings/date";
import { MeasurementUnit } from "@netpoe/restodynamics-api";
import { History } from "history";
import { get } from "lodash";
import { DateTime } from "luxon";
import * as math from "mathjs";
import React from "react";
import { RouteComponentProps } from "react-router";
import { Link } from "react-router-dom";
import { useMutation, useQuery } from "urql";
import { Breadcrumbs, DashboardNavigationDrawer, ToolbarPadding } from "../../components";
import { UpdateInventoryUnit } from "../../graphql/mutations";
import { QueryStockUnit, QueryStockUnitRelationships } from "../../graphql/queries";
import { styles } from "../../theme";
import { datetime } from "../../utils";
import { routes } from "../routes";
import { StockUnitDetailsDrawer } from "./components";

interface IStockUnitInventoriesProps extends RouteComponentProps<{ id: string }> {
  classes: any;
  history: History;
}

export const StockUnitInventories = withStyles((theme: Theme) => ({
  ...styles(theme),
  stockUnitInput: {
    fontSize: theme.typography.h5.fontSize,
    "& input": {
      fontSize: theme.typography.h5.fontSize,
      [theme.breakpoints.down("md")]: {
        fontSize: theme.typography.body1.fontSize,
      },
    },
  },
}))(({ classes, match, history, ...props }: IStockUnitInventoriesProps) => {
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
  const [currentInventoryUnitID, setCurrentInventoryUnitID] = React.useState<string | null>(null);
  const [stockUnitDetailsQuery] = useQuery({
    query: QueryStockUnit,
    variables: {
      where: {
        id: match.params.id || "",
      },
      inventoryUnitsOrderBy: "createdAt_DESC",
      inventoryUnitsWhere: {
        inventory: {
          id_not: null,
        },
      },
    },
  });

  const [stockUnitRelationshipsQuery] = useQuery({
    query: QueryStockUnitRelationships,
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
      const quantity = math.round(Number(math.evaluate(e.target.value)), 2).toString();
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
      const amount = math.round(Number(math.evaluate(e.target.value)), 2).toString();
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

  const measurementUnits = get(stockUnitRelationshipsQuery.data, "measurementUnits", []);

  return (
    <MuiPickersUtilsProvider utils={LuxonUtils}>
      <Box display="flex">
        <DashboardNavigationDrawer history={history} />
        <StockUnitDetailsDrawer match={match} history={history} {...props} />
        <Box minHeight="100vh" bgcolor="default" flexGrow={1}>
          <ToolbarPadding />
          <Container maxWidth="xl">
            {stockUnitDetailsQuery.fetching ? (
              <Typography>Cargando</Typography>
            ) : stockUnitDetailsQuery.error || stockUnitDetailsQuery.data == null ? (
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
                      <Link color="inherit" to={routes.stock.index}>
                        Stock
                      </Link>
                      <Typography color="textPrimary">Inventario</Typography>
                      <Typography color="textPrimary" style={{ textTransform: "capitalize" }}>
                        {stockUnitDetailsQuery.data.stockUnit.name}
                      </Typography>
                    </Breadcrumbs>
                  </Toolbar>
                </AppBar>
                {stockUnitDetailsQuery.data.stockUnit.inventoryUnits.map(
                  (inventoryUnit: any, i: number) => (
                    <Box mb={2} key={i}>
                      <Paper>
                        <Container maxWidth="xl">
                          <Grid container spacing={2}>
                            <Grid item lg={5} sm={4}>
                              <Box
                                minHeight={56}
                                display="flex"
                                flexDirection="column"
                                justifyContent="center"
                                position="relative"
                              >
                                <Link
                                  to={`${routes.inventory.overview}/${inventoryUnit.inventory.id}`}
                                >
                                  <Typography
                                    variant="h5"
                                    className={classes.typography}
                                    style={{ textTransform: "capitalize" }}
                                  >
                                    {
                                      datetime.locale(inventoryUnit.inventory.createdAt)
                                        .weekdayShort
                                    }{" "}
                                    {datetime
                                      .locale(inventoryUnit.inventory.createdAt)
                                      .toLocaleString(DateTime.DATETIME_MED)}
                                  </Typography>
                                </Link>
                              </Box>
                            </Grid>
                            <Grid item lg={7} sm={8}>
                              <Box>
                                <Grid container spacing={2}>
                                  <Grid item lg={2} sm={2}>
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
                                  <Grid item lg={2} sm={2}>
                                    <Box
                                      minHeight={56}
                                      display="flex"
                                      flexDirection="column"
                                      justifyContent="center"
                                    >
                                      <Typography
                                        variant="h5"
                                        className={classes.typography}
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
                                  <Grid item lg={2} sm={2}>
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
                                  <Grid item lg={2} sm={2}>
                                    <Box
                                      minHeight={56}
                                      display="flex"
                                      flexDirection="column"
                                      justifyContent="center"
                                    >
                                      <Typography variant="h5" className={classes.typography}>
                                        {inventoryUnit.expenseUnit.currency.symbol}
                                      </Typography>
                                    </Box>
                                  </Grid>
                                  <Grid item lg={4} sm={4}>
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
            )}
          </Container>
        </Box>
      </Box>
    </MuiPickersUtilsProvider>
  );
});
