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
import { first, get } from "lodash";
import { DateTime as LuxonDateTime } from "luxon";
import React from "react";
import { Link } from "react-router-dom";
import { useQuery } from "urql";
import {
  Breadcrumbs,
  Card,
  CardTitle,
  DashboardNavigationDrawer,
  ToolbarPadding,
} from "../../components";
import { QueryStockUnits } from "../../graphql/queries";
import { datetime } from "../../utils";
import { routes } from "../routes";

export const StockUnitIndex = withStyles((theme: Theme) => ({
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
    <Box display="flex">
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
                {stockUnitsQuery.data.stockUnits.map((stockUnit: any, i: number) => (
                  <Grid item lg={4} key={i}>
                    <Card onClick={(e: any) => handleOnTableRowClick(e, stockUnit.id)}>
                      <CardTitle>{get(stockUnit, "category.name", null)}</CardTitle>
                      <Typography variant="h5" color="inherit">
                        {stockUnit.name}
                      </Typography>
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
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Container>
          </>
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
