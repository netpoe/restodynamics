import { Box, Container, Grid, Menu, MenuItem, Paper, TextField, Theme, Typography, withStyles } from "@material-ui/core";
import { Component, MeasurementUnit } from "@netpoe/restodynamics-api";
import { get } from "lodash";
import { DateTime } from "luxon";
import { default as React } from "react";
import { Link } from "react-router-dom";
import { useMutation, useQuery } from "urql";
import { UpdateComponent } from "../../../graphql/mutations";
import { QueryStockUnitRelationships } from "../../../graphql/queries";
import { styles } from "../../../theme";
import { datetime, getComponentCostByMeasurementUnit } from "../../../utils";
import { routes } from "../../routes";

export const StockUnitChildComponents = withStyles((theme: Theme) => ({
  ...styles(theme),
  stockUnitInput: {
    fontSize: theme.typography.h5.fontSize,
  },
}))(({ classes, components }: { classes: any; components: Component[] }) => {
  const [updateComponentMutation, executeUpdateComponentMutation] = useMutation(UpdateComponent);
  const [currentComponentID, setCurrentComponentID] = React.useState<string | null>(null);
  const [stockUnitRelationshipsQuery] = useQuery({
    query: QueryStockUnitRelationships,
  });
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);

  const updateComponentMeasurementUnitSymbol = async (
    e: React.MouseEvent<HTMLLIElement, MouseEvent>,
  ) => {
    try {
      const symbol = e.currentTarget.innerText;
      await executeUpdateComponentMutation({
        where: {
          id: currentComponentID,
        },
        data: {
          inventoryUnit: {
            update: {
              unit: {
                connect: {
                  symbol,
                },
              },
            },
          },
        },
      });
      setAnchorEl(null);
    } catch (error) {
      console.error(error);
    }
  };

  const updateComponentQuantity = async (e: React.ChangeEvent<HTMLInputElement>, id: string) => {
    if (!Boolean(e.target.value)) {
      return;
    }
    try {
      const quantity = Number(e.target.value)
        .toFixed(2)
        .toString();
      await executeUpdateComponentMutation({
        where: {
          id,
        },
        data: {
          inventoryUnit: {
            update: {
              quantity,
            },
          },
        },
      });
    } catch (error) {
      console.error(error);
    }
  };

  const measurementUnits = get(stockUnitRelationshipsQuery.data, "measurementUnits", []);

  const getCost = (component: any) => {
    return getComponentCostByMeasurementUnit(component).toFixed(4);
  };

  return (
    <Box>
      {components.map((component: any, i: number) => (
        <Box mb={2} key={i}>
          <Paper>
            <Container maxWidth="xl">
              <Grid container spacing={2}>
                <Grid item lg={5} sm={4}>
                  <Box minHeight={56} display="flex" flexDirection="column" justifyContent="center">
                    <Link to={`${routes.stock.overview}/${component.inventoryUnit.stockUnit.id}`}>
                      <Typography variant="h5" style={{ textTransform: "capitalize" }}>
                        {component.inventoryUnit.stockUnit.name}
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
                              updateComponentQuantity(e, component.id);
                            }}
                            placeholder={component.inventoryUnit.quantity || "0.00"}
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
                            onClick={(e: React.MouseEvent<HTMLElement, MouseEvent>) => {
                              setAnchorEl(e.currentTarget);
                              setCurrentComponentID(component.id);
                            }}
                          >
                            {component.inventoryUnit.unit.symbol}
                          </Typography>
                          <Menu
                            id={`inventory-unit-measurement-symbol-${component.id}`}
                            anchorEl={anchorEl}
                            keepMounted
                            open={Boolean(anchorEl)}
                            onClose={() => {
                              setAnchorEl(null);
                            }}
                          >
                            {measurementUnits.map((unit: MeasurementUnit, i: number) => (
                              <MenuItem
                                key={i}
                                onClick={(e: React.MouseEvent<HTMLLIElement, MouseEvent>) => {
                                  updateComponentMeasurementUnitSymbol(e);
                                }}
                              >
                                {unit.symbol}
                              </MenuItem>
                            ))}
                          </Menu>
                        </Box>
                      </Grid>
                      <Grid item lg={2} sm={2}>
                        <Box
                          minHeight={56}
                          display="flex"
                          flexDirection="column"
                          justifyContent="center"
                          textAlign="right"
                        >
                          <Typography variant="h5" color="textSecondary">
                            {getCost(component)}
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item lg={2} sm={2}>
                        <Box
                          minHeight={56}
                          display="flex"
                          flexDirection="column"
                          justifyContent="center"
                        >
                          <Typography variant="h5" color="textSecondary">
                            {get(
                              component.inventoryUnit.stockUnit,
                              "inventoryUnits.0.expenseUnit.currency.symbol",
                              "GTQ",
                            )}
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
                          <Typography variant="h5" color="textSecondary">
                            {datetime.locale(get(
                              component.inventoryUnit.stockUnit,
                              "inventoryUnits.0.expiresAt",
                              null,
                            )).toLocaleString(DateTime.DATE_MED)}
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>
                  </Box>
                </Grid>
              </Grid>
            </Container>
          </Paper>
        </Box>
      ))}
    </Box>
  );
});
