import {
  AppBar,
  Box,
  Button,
  Container,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
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
import { routes } from "../routes";

export const StockUnitIndex = withStyles(theme => ({
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
    history.push(`${routes.stock.details}/${id}`);
  };

  return (
    <>
      {stockUnitsQuery.fetching ? (
        <Typography>Cargando</Typography>
      ) : stockUnitsQuery.error || stockUnitsQuery.data == null ? (
        <Typography>Error</Typography>
      ) : (
        <Box minHeight="100vh" bgcolor="default" pt={4}>
          <Container maxWidth="xl">
            <AppBar className={classes.appBar} elevation={0} position="relative" color="inherit">
              <Toolbar className={classes.toolbar} disableGutters>
                <Box>
                  <Typography variant="h6">Inventario [fecha de último inventario]</Typography>
                </Box>
                <Box>
                  <Grid container spacing={2}>
                    <Grid item>
                      <Button size="large" variant="outlined" color="default">
                        Nuevo inventario
                      </Button>
                    </Grid>
                    <Grid item>
                      <Link to={routes.stock.details}>
                        <Button size="large" variant="contained" color="primary">
                          Nuevo artículo
                        </Button>
                      </Link>
                    </Grid>
                  </Grid>
                </Box>
              </Toolbar>
            </AppBar>
            <Paper>
              <Table className={classes.table}>
                <TableHead>
                  <TableRow>
                    <StyledTableCell>Nombre</StyledTableCell>
                    <StyledTableCell>Categoría</StyledTableCell>
                    <StyledTableCell>Proveedor</StyledTableCell>
                    <StyledTableCell>Expira en</StyledTableCell>
                    <StyledTableCell>Cantidad</StyledTableCell>
                    <StyledTableCell>Último costo</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {stockUnitsQuery.data.stockUnits.map((row: any, i: number) => (
                    <TableRow key={i} onClick={(e: any) => handleOnTableRowClick(e, row.id)}>
                      <TableCell>{row.name}</TableCell>
                      <TableCell style={{ textTransform: "capitalize" }}>
                        {get(row.stockUnitCategory, ["es_ES"], null)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Paper>
          </Container>
        </Box>
      )}
    </>
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
