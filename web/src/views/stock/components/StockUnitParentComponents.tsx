import { Box, Grid, Theme, Typography, withStyles } from "@material-ui/core";
import React from "react";
import { Link } from "react-router-dom";
import { useQuery } from "urql";
import { QueryComponents } from "../../../graphql/queries";
import { styles } from "../../../theme";
import { routes } from "../../routes";

export const StockUnitParentComponents = withStyles((theme: Theme) => ({
  ...styles(theme),
}))(({ classes, id }: { classes: any; id: string }) => {
  const [stockUnitParentComponentsQuery] = useQuery({
    query: QueryComponents,
    variables: { where: { inventoryUnit: { stockUnit: { id } } } },
  });

  return (
    <Box>
      {stockUnitParentComponentsQuery.fetching ? (
        <Typography>Cargando</Typography>
      ) : stockUnitParentComponentsQuery.error || stockUnitParentComponentsQuery.data == null ? (
        <Typography>Error</Typography>
      ) : (
        <>
          {stockUnitParentComponentsQuery.data.components.map((component: any, i: number) => (
            <Grid container key={i} spacing={1}>
              <Grid item>
                <Box minHeight={28} display="flex" flexDirection="column" justifyContent="center">
                  <Link to={`${routes.stock.overview}/${component.stockUnit.id}`}>
                    <Typography style={{ textTransform: "capitalize" }}>
                      {component.stockUnit.name}
                    </Typography>
                  </Link>
                </Box>
              </Grid>
            </Grid>
          ))}
        </>
      )}
    </Box>
  );
});
