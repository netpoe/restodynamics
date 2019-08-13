import {
  Box,
  Breadcrumbs,
  Button,
  Card,
  CardActions,
  CardContent,
  Container,
  Grid,
  List,
  ListItem,
  ListItemText,
  Paper,
  TextField,
  Theme,
  Typography,
  withStyles,
} from "@material-ui/core";
import CachedOutlinedIcon from "@material-ui/icons/CachedOutlined";
import CheckCircleOutlineIcon from "@material-ui/icons/CheckCircleOutline";
import InfoOutlinedIcon from "@material-ui/icons/InfoOutlined";
import { History } from "history";
import { get } from "lodash";
import React from "react";
import { RouteComponentProps } from "react-router";
import { Link } from "react-router-dom";
import { CombinedError, useMutation, useQuery } from "urql";
import { QueryStockUnit } from "../../api/queries";
import { routes } from "../routes";
import { StockUnitDetailsDrawer } from "./components";

interface IStockUnitDetailsProps extends RouteComponentProps<{ id: string }> {
  classes: any;
  history: History;
}

export const StockUnitOverview = withStyles((theme: Theme) => ({
  root: {
    display: "flex",
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  paper: {
    padding: theme.spacing(1, 2),
    width: "fit-content",
  },
  toolbar: theme.mixins.toolbar,
  breadcrumbContainer: {
    marginBottom: theme.spacing(5),
  },
  card: {
    minHeight: 140,
    "&.urgent": {
      backgroundColor: theme.palette.error.main,
      color: "white",
      "& .card-title": {
        color: "inherit",
      },
    },
    "& .card-title": {
      color: theme.palette.text.secondary,
    },
  },
}))(({ classes, match, history }: IStockUnitDetailsProps) => {
  const [stockUnitDetailsQuery] = useQuery({
    query: QueryStockUnit,
    variables: { where: { id: match.params.id || "" } },
  });

  return (
    <div className={classes.root}>
      <StockUnitDetailsDrawer history={history} />
      <Box minHeight="100vh" bgcolor="default" className={classes.content}>
        {stockUnitDetailsQuery.fetching ? (
          <Typography>Cargando</Typography>
        ) : stockUnitDetailsQuery.error || stockUnitDetailsQuery.data == null ? (
          <Typography>Error</Typography>
        ) : (
          <>
            <div className={classes.toolbar} />
            <Container maxWidth="xl" className={classes.breadcrumbContainer}>
              <Paper elevation={1} className={classes.paper}>
                <Breadcrumbs aria-label="breadcrumb">
                  <Link color="inherit" to={routes.stock.index}>
                    Stock
                  </Link>
                  <Typography color="textPrimary">Vista General</Typography>
                  <Typography color="textPrimary">
                    {match.params.id
                      ? `${stockUnitDetailsQuery.data.stockUnit.name}`
                      : "Nueva Unidad de Inventario"}
                  </Typography>
                </Breadcrumbs>
              </Paper>
            </Container>
            <Container maxWidth="xl">
              <Box mb={3}>
                <StockUnitNameField
                  id={get(stockUnitDetailsQuery.data.stockUnit, ["id"], "")}
                  value={get(stockUnitDetailsQuery.data.stockUnit, ["name"], "")}
                />
              </Box>
              <Grid container spacing={2}>
                <Grid item lg={4}>
                  <Card className={classes.card}>
                    <CardContent>
                      <Typography
                        variant="overline"
                        color="inherit"
                        gutterBottom
                        className={`card-title`}
                      >
                        Categoría
                      </Typography>
                      <Typography variant="h5" color="inherit">
                        Ingrediente
                      </Typography>
                    </CardContent>
                    <CardActions>
                      <Button size="small">Editar</Button>
                    </CardActions>
                  </Card>
                </Grid>
                <Grid item lg={4}>
                  <Card className={`${classes.card}`}>
                    <CardContent>
                      <Typography
                        variant="overline"
                        color="inherit"
                        gutterBottom
                        className={`card-title`}
                      >
                        Cantidad disponible
                      </Typography>
                      <Typography variant="h5" color="inherit">
                        3 libras
                      </Typography>
                    </CardContent>
                    <CardActions>
                      <Button size="small" color="inherit">
                        Inventario
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
                <Grid item lg={4}>
                  <Card className={`${classes.card} urgent`}>
                    <CardContent>
                      <Typography
                        variant="overline"
                        color="inherit"
                        gutterBottom
                        className={`card-title`}
                      >
                        Expira en
                      </Typography>
                      <Typography variant="h5" color="inherit">
                        5 días
                      </Typography>
                    </CardContent>
                    <CardActions>
                      <Button size="small" color="inherit">
                        Inventario
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              </Grid>
              <Box mt={3}>
                <Card className={classes.card}>
                  <CardContent>
                    <Typography
                      variant="overline"
                      color="inherit"
                      gutterBottom
                      className={`card-title`}
                    >
                      Se utiliza en estos productos
                    </Typography>
                    <List>
                      <ListItem button>
                        <ListItemText primary="Cazuela de Pepián" />
                      </ListItem>
                      <ListItem button>
                        <ListItemText primary="Cazuela de Hilachas" />
                      </ListItem>
                    </List>
                  </CardContent>
                </Card>
              </Box>
            </Container>
          </>
        )}
      </Box>
    </div>
  );
});

const StockUnitNameField = withStyles((theme: Theme) => ({
  paper: {
    position: "relative",
    padding: theme.spacing(2),
  },
  textField: {
    "& input": {
      ...theme.typography.h5,
      fontWeight: 500,
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
  const [mutation, executeMutation] = useMutation(`
    mutation ($where: StockUnitWhereUniqueInput!, $create: StockUnitCreateInput!, $update: StockUnitUpdateInput!) {
      upsertStockUnit(where: $where, create: $create, update: $update) {
        id
        name
      }
    }
  `);

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
