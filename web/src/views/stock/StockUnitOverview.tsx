import { Backdrop, Box, Button, Chip, Container, Fade, Grid, Menu, MenuItem, Modal, Paper, TextField, Theme, Typography, withStyles } from "@material-ui/core";
import CachedOutlinedIcon from "@material-ui/icons/CachedOutlined";
import CheckCircleOutlineIcon from "@material-ui/icons/CheckCircleOutline";
import InfoOutlinedIcon from "@material-ui/icons/InfoOutlined";
import { Component, MeasurementUnit, StockUnit } from "@netpoe/restodynamics-api";
import { History } from "history";
import { get } from "lodash";
import React from "react";
import { RouteComponentProps } from "react-router";
import { Link } from "react-router-dom";
import { CombinedError, useMutation, useQuery } from "urql";
import { Breadcrumbs, Card, CardTitle, DashboardNavigationDrawer, ToolbarPadding } from "../../components";
import { ConnectComponentsToStockUnit, CreateComponent, UpdateComponent, UpsertStockUnit } from "../../graphql/mutations";
import { QueryStockUnit, QueryStockUnitRelationships, QueryStockUnits } from "../../graphql/queries";
import { styles } from "../../theme";
import { routes } from "../routes";
import { StockUnitDetailsDrawer } from "./components";

interface IStockUnitDetailsProps extends RouteComponentProps<{ id: string }> {
  classes: any;
  history: History;
}

const StockUnitNameField = withStyles((theme: Theme) => ({
  paper: {
    position: "relative",
    padding: theme.spacing(2),
  },
  textField: {
    "& input": {
      ...theme.typography.h5,
      fontWeight: 500,
      textTransform: "capitalize",
    },
  },
  iconBox: {
    position: "absolute",
    right: 14,
    top: 0,
    width: 35,
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
}))(({ id, value, classes }: { id: string; value: any; classes: any }) => {
  const [isLoading, setLoading] = React.useState(false);
  const [name, setName] = React.useState(value);
  const [error, setError] = React.useState<CombinedError | undefined | string>(undefined);
  const [success, setSuccess] = React.useState(false);
  const [mutation, executeMutation] = useMutation(UpsertStockUnit);

  const upsert = async () => {
    if (!name) {
      setError(`Empty field`);
      return;
    }

    setSuccess(false);
    setLoading(true);

    const { data, error: mutationError } = await executeMutation({
      where: {
        id,
      },
      create: {
        name,
      },
      update: {
        name,
      },
    });

    setLoading(false);

    if (mutationError) {
      setSuccess(false);
      setError(mutationError);
      console.error(mutationError);
    } else {
      setSuccess(true);
      setError(undefined);
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    }
  };

  return (
    <Paper className={classes.paper} elevation={1}>
      <Box className={classes.iconBox}>
        {isLoading ? (
          <CachedOutlinedIcon />
        ) : error ? (
          <InfoOutlinedIcon />
        ) : success ? (
          <CheckCircleOutlineIcon color="primary" />
        ) : (
          <></>
        )}
      </Box>
      <TextField
        error={Boolean(error)}
        fullWidth
        id={id}
        name="name"
        variant="outlined"
        label="Nombre"
        autoFocus={!Boolean(id)}
        value={name}
        className={classes.textField}
        onChange={(e: any) => setName(e.target.value)}
        onBlur={upsert}
      />
    </Paper>
  );
});

const LinkStockUnitsModal = withStyles((theme: Theme) => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  stockUnitsList: {
    backgroundColor: theme.palette.background.default,
    minHeight: 140,
    paddingRight: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },
  chip: {
    marginTop: theme.spacing(1),
    marginLeft: theme.spacing(1),
  },
}))(
  ({
    classes,
    onClose,
    id,
    onConnect,
  }: {
    classes: any;
    onClose: () => void;
    id: string;
    onConnect: (componentsIDs: string[]) => Promise<void>;
  }) => {
    const [open, setOpen] = React.useState(true);
    const [selectedComponentsIDs, setSelectedComponentsIDs] = React.useState<string[]>([]);
    const [stockUnitsQuery] = useQuery({
      query: QueryStockUnits,
      variables: { where: { id_not: id } },
    });

    const onSelectStockUnit = (id: string) => {
      if (selectedComponentsIDs.includes(id)) {
        selectedComponentsIDs.splice(selectedComponentsIDs.indexOf(id), 1);
        setSelectedComponentsIDs([...selectedComponentsIDs]);
      } else {
        setSelectedComponentsIDs([...selectedComponentsIDs, id]);
      }
    };

    const onConnectStockUnitsIDs = async () => {
      try {
        await onConnect(selectedComponentsIDs);
        onClose();
      } catch (error) {
        console.error(error);
      }
    };

    return (
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={open}
        onClose={onClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <Box maxWidth="50vh">
            <Card
              actions={
                <>
                  <Button onClick={onClose}>Cancelar</Button>
                  <Button onClick={onConnectStockUnitsIDs} color="primary">
                    Vincular
                  </Button>
                </>
              }
            >
              <CardTitle>Vincular otras unidades de inventario</CardTitle>
              <Box className={classes.stockUnitsList}>
                {stockUnitsQuery.fetching ? (
                  <Typography>Cargando</Typography>
                ) : stockUnitsQuery.error || stockUnitsQuery.data == null ? (
                  <Typography>Error</Typography>
                ) : (
                  <>
                    {stockUnitsQuery.data.stockUnits.map((stockUnit: StockUnit, i: number) => (
                      <Chip
                        key={i}
                        label={stockUnit.name}
                        className={classes.chip}
                        onClick={() => {
                          onSelectStockUnit(stockUnit.id);
                        }}
                        variant={
                          selectedComponentsIDs.includes(stockUnit.id) ? "outlined" : "default"
                        }
                        color={selectedComponentsIDs.includes(stockUnit.id) ? "primary" : "default"}
                      />
                    ))}
                  </>
                )}
              </Box>
            </Card>
          </Box>
        </Fade>
      </Modal>
    );
  },
);

export const StockUnitComponents = withStyles((theme: Theme) => ({
  ...styles(theme),
  stockUnitInput: {
    fontSize: theme.typography.body1.fontSize,
  },
  root: {
    display: "flex",
  },
  content: {
    flexGrow: 1,
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
            }
          }
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

  return (
    <Box>
      {components.map((component: any, i: number) => (
        <Grid container key={i} spacing={1}>
          <Grid item lg={6}>
            <Box minHeight={28} display="flex" flexDirection="column" justifyContent="center">
              <Typography style={{ textTransform: "capitalize" }}>
                {component.inventoryUnit.stockUnit.name}
              </Typography>
            </Box>
          </Grid>
          <Grid item lg={2}>
            <Box minHeight={28} display="flex" flexDirection="column" justifyContent="center">
              <TextField
                InputProps={{ className: `${classes.stockUnitInput} ${classes.stockUnitInputBase}` }}
                fullWidth
                onBlur={(e: React.ChangeEvent<HTMLInputElement>) => {
                  updateComponentQuantity(e, component.id);
                }}
                placeholder={component.inventoryUnit.quantity || "0.00"}
              />
            </Box>
          </Grid>
          <Grid item lg={2}>
            <Box minHeight={28} display="flex" flexDirection="column" justifyContent="center">
              <Typography
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
        </Grid>
      ))}
    </Box>
  );
});

export const StockUnitOverview = withStyles((theme: Theme) => ({
  root: {
    display: "flex",
  },
  content: {
    flexGrow: 1,
  },
}))(({ classes, match, history }: IStockUnitDetailsProps) => {
  const [stockUnitDetailsQuery] = useQuery({
    query: QueryStockUnit,
    variables: { where: { id: match.params.id || "" } },
  });

  const [createComponentMutation, executeCreateComponentMutation] = useMutation(CreateComponent);
  const [
    connectComponentsToStockUnitMutation,
    executeConnectComponentsToStockUnitMutation,
  ] = useMutation(ConnectComponentsToStockUnit);

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
    <div className={classes.root}>
      <DashboardNavigationDrawer history={history} />
      <StockUnitDetailsDrawer history={history} />
      <Box minHeight="100vh" bgcolor="default" className={classes.content}>
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
              <Box mt={3}>
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
                                    setDisplayStockUnitsModal(true);
                                  }}
                                >
                                  Vincular
                                </Button>
                              </Grid>
                            </Grid>
                          </Box>
                        }
                      >
                        Se conforma de estos componentes
                      </CardTitle>
                      <StockUnitComponents
                        components={stockUnitDetailsQuery.data.stockUnit.components}
                      />
                    </Card>
                  </Grid>
                  <Grid item lg={6}>
                    <Card>
                      <CardTitle>Se utiliza en estas unidades</CardTitle>
                    </Card>
                  </Grid>
                </Grid>
              </Box>
            </Box>
          )}
        </Container>
      </Box>
    </div>
  );
});
