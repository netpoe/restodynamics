import {
  Box,
  Breadcrumbs,
  Container,
  Paper,
  TextField,
  Theme,
  Typography,
  withStyles,
} from "@material-ui/core";
import CachedOutlinedIcon from "@material-ui/icons/CachedOutlined";
import CheckCircleOutlineIcon from "@material-ui/icons/CheckCircleOutline";
import InfoOutlinedIcon from "@material-ui/icons/InfoOutlined";
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
}))(({ classes, match }: IStockUnitDetailsProps) => {
  const [stockUnitDetailsQuery] = useQuery({
    query: QueryStockUnit,
    variables: { where: { id: match.params.id || "" } },
  });

  return (
    <>
      {stockUnitDetailsQuery.fetching ? (
        <Typography>Cargando</Typography>
      ) : stockUnitDetailsQuery.error || stockUnitDetailsQuery.data == null ? (
        <Typography>Error</Typography>
      ) : (
        <div className={classes.root}>
          <StockUnitDetailsDrawer />
          <Box minHeight="100vh" bgcolor="default" className={classes.content}>
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
              <StockUnitNameField
                id={get(stockUnitDetailsQuery.data.stockUnit, ["id"], "")}
                value={get(stockUnitDetailsQuery.data.stockUnit, ["name"], "")}
              />
            </Container>
          </Box>
        </div>
      )}
    </>
  );
});

const StockUnitNameField = withStyles((theme: Theme) => ({
  paper: {
    position: "relative",
    padding: theme.spacing(2),
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
        onChange={(e: any) => setName(e.target.value)}
        onBlur={upsert}
      />
    </Paper>
  );
});
