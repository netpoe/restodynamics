import {
  AppBar,
  Box,
  Button,
  Container,
  Grid,
  TableCell,
  Theme,
  Toolbar,
  Typography,
  withStyles,
} from "@material-ui/core";
import { History } from "history";
import { get } from "lodash";
import React from "react";
import { Link } from "react-router-dom";
import { useQuery } from "urql";
import { QueryStockUnits } from "../../api/queries";
import {
  Breadcrumbs,
  Card,
  CardTitle,
  DashboardNavigationDrawer,
  ToolbarPadding,
} from "../../components";
import { routes } from "../routes";

export const StockUnitIndex = withStyles((theme: Theme) => ({
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
  const [stockUnitsQuery] = useQuery({
    query: QueryStockUnits,
  });

  const handleOnTableRowClick = (e: any, id: string) => {
    history.push(`${routes.stock.overview}/${id}`);
  };

  return (
    <div className={classes.root}>
      <DashboardNavigationDrawer history={history} />
      <Box minHeight="100vh" bgcolor="default" className={classes.content}>
        <ToolbarPadding />
        {stockUnitsQuery.fetching ? (
          <Typography>Cargando</Typography>
        ) : stockUnitsQuery.error || stockUnitsQuery.data == null ? (
          <Typography>Error</Typography>
        ) : (
          <>
            <Container maxWidth="xl">
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
                        <Button size="large" variant="outlined" color="default">
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
                {stockUnitsQuery.data.stockUnits.map((row: any, i: number) => (
                  <Grid item lg={4} key={i}>
                    <Card onClick={(e: any) => handleOnTableRowClick(e, row.id)}>
                      <CardTitle>{get(row.stockUnitCategory, ["name"], null)}</CardTitle>
                      <Typography variant="h5" color="inherit">
                        {row.name}
                      </Typography>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Container>
          </>
        )}
      </Box>
    </div>
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
