import { Box, Container, TextField, Theme, Typography, withStyles } from "@material-ui/core";
import { get } from "lodash";
import React from "react";
import { RouteComponentProps } from "react-router";
import { CombinedError, useMutation, useQuery } from "urql";
import { QueryStockUnit } from "../../api/queries";

interface IStockUnitDetailsProps extends RouteComponentProps<{ id: string }> {
  classes: any;
}

export const StockUnitDetails = withStyles((theme: Theme) => ({}))(
  ({ classes, match }: IStockUnitDetailsProps) => {
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
          <Box minHeight="100vh" bgcolor="default" pt={4}>
            <Container maxWidth="xl">
              <Typography variant="h6">
                {match.params.id
                  ? `Unidad de inventario: ${stockUnitDetailsQuery.data.stockUnit.name}`
                  : "Nueva Unidad de Inventario"}
              </Typography>
              <StockUnitNameField
                id={get(stockUnitDetailsQuery.data.stockUnit, ["id"], "")}
                value={get(stockUnitDetailsQuery.data.stockUnit, ["name"], "")}
              />
            </Container>
          </Box>
        )}
      </>
    );
  },
);

const StockUnitNameField = ({ id, value }: { id: string; value: any }) => {
  const [name, setName] = React.useState(value);
  const [error, setError] = React.useState<CombinedError | undefined>(undefined);
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
      return;
    }

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
    setError(mutationError);
  };

  return (
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
  );
};
