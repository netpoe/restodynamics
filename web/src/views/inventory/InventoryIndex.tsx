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
import { ButtonProps } from "@material-ui/core/Button";
import CachedOutlinedIcon from "@material-ui/icons/CachedOutlined";
import CheckCircleOutlineIcon from "@material-ui/icons/CheckCircleOutline";
import InfoOutlinedIcon from "@material-ui/icons/InfoOutlined";
import { History } from "history";
import moment from "moment";
import React from "react";
import { Link } from "react-router-dom";
import { CombinedError, useMutation, useQuery } from "urql";
import {
  Breadcrumbs,
  Card,
  CardTitle,
  DashboardNavigationDrawer,
  ToolbarPadding,
} from "../../components";
import { QueryStockUnits } from "../../graphql/queries";
import { routes } from "../routes";

export const InventoryIndex = withStyles((theme: Theme) => ({
  root: {
    display: "flex",
  },
  content: {
    flexGrow: 1,
  },
  appBar: {
    marginBottom: theme.spacing(3),
    [theme.breakpoints.down("sm")]: {},
  },
  toolbar: {
    justifyContent: "space-between",
    [theme.breakpoints.down("sm")]: {},
  },
}))(({ classes, history }: { classes: any; history: History }) => {
  const [queryStockUnits] = useQuery({
    query: QueryStockUnits,
  });

  return (
    <div className={classes.root}>
      <DashboardNavigationDrawer history={history} />
      <Box minHeight="100vh" bgcolor="default" className={classes.content}>
        <ToolbarPadding />
        {queryStockUnits.fetching ? (
          <Typography>Cargando</Typography>
        ) : queryStockUnits.error || queryStockUnits.data == null ? (
          <Typography>Error</Typography>
        ) : (
          <Container maxWidth="xl">
            <AppBar className={classes.appBar} elevation={0} position="relative" color="default">
              <Toolbar className={classes.toolbar} disableGutters>
                <Breadcrumbs>
                  <Link color="inherit" to={routes.inventory.index}>
                    Inicio
                  </Link>
                  <Typography color="textPrimary">Inventario</Typography>
                </Breadcrumbs>
                <Box>
                  <Grid container spacing={2}>
                    <Grid item>
                      <CreateInventoryButton
                        disabled={
                          moment(queryStockUnits.data.stockUnits[0].createdAt).format(
                            "YYYYMMDD",
                          ) === moment().format("YYYYMMDD")
                        }
                        onSuccess={(inventoryID: string) =>
                          history.push(`${routes.inventory.overview}/${inventoryID}`)
                        }
                      />
                    </Grid>
                  </Grid>
                </Box>
              </Toolbar>
            </AppBar>
            <Grid container spacing={2}>
              {queryStockUnits.data.stockUnits.map((row: any, i: number) => (
                <Grid item lg={4} key={i}>
                  <Card onClick={() => history.push(`${routes.inventory.overview}/${row.id}`)}>
                    <CardTitle>Fecha</CardTitle>
                    <Typography variant="h5" color="inherit">
                      {moment(row.createdAt).format("MMMM DD, YYYY")}
                    </Typography>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Container>
        )}
      </Box>
    </div>
  );
});

interface ICreateInventoryButton extends ButtonProps {
  classes: any;
  onSuccess: (inventoryID: string) => any;
}

const CreateInventoryButton = withStyles((theme: Theme) => ({}))(
  ({ classes, onSuccess, ...rest }: ICreateInventoryButton) => {
    const [isLoading, setLoading] = React.useState(false);
    const [error, setError] = React.useState<CombinedError | undefined | string>(undefined);
    const [success, setSuccess] = React.useState(false);
    const [mutation, executeMutation] = useMutation(`
    mutation {
      createInventory(data: {}) {
        id
        label
        createdAt
      }
    }
  `);

    const create = async () => {
      // if (!name) {
      //   setError(`Empty field`);
      //   return;
      // }

      setSuccess(false);
      setLoading(true);

      const { data, error: mutationError } = await executeMutation();

      if (mutationError) {
        setSuccess(false);
        setError(mutationError);
        console.error(mutationError);
      } else {
        setSuccess(true);
        setError(undefined);
        setTimeout(() => {
          setSuccess(false);
          onSuccess(data.createInventory.id);
        }, 3000);
      }
    };

    return (
      <Button size="large" variant="contained" color="primary" onClick={() => create()} {...rest}>
        Nuevo inventario{" "}
        {isLoading ? (
          <CachedOutlinedIcon />
        ) : error ? (
          <InfoOutlinedIcon />
        ) : success ? (
          <CheckCircleOutlineIcon color="primary" />
        ) : (
          <></>
        )}
      </Button>
    );
  },
);
