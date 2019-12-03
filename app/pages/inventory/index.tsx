import { Box, Container, Grid, Theme, Typography } from "@material-ui/core";
import { withStyles } from "@material-ui/styles";
import { NextPage } from "next";
import { useQuery } from "urql";
import { Card, CardTitle, DashboardNavigationDrawer, Layout } from "../../components";
import { StockUnits } from "../../graphql/queries";

type Props = {};

const Wrapper = withStyles((theme: Theme) => ({}))(() => (
  <Layout>
    <DashboardNavigationDrawer />
    <InventoryIndex />
  </Layout>
)) as NextPage<Props>;

const InventoryIndex = withStyles((theme: Theme) => ({}))(() => {
  const [stockUnitsQuery] = useQuery({
    query: StockUnits,
  });

  return (
    <Layout>
      <DashboardNavigationDrawer />
      <Box>
        <Container maxWidth="xl">
          {stockUnitsQuery.fetching ? (
            <Typography>Cargando</Typography>
          ) : stockUnitsQuery.error || stockUnitsQuery.data == null ? (
            <Typography>Error</Typography>
          ) : (
            <Grid container spacing={2}>
              {stockUnitsQuery.data.stockUnits.map((row: any, i: number) => (
                <Grid item lg={4} key={i}>
                  <Card>
                    <CardTitle>Tomates</CardTitle>
                    <Typography variant="h5" color="inherit">
                      {row.name}
                    </Typography>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Container>
      </Box>
    </Layout>
  );
}) as NextPage;

export default Wrapper;
