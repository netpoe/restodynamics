import { Box, Container, TextField, Theme, Typography, withStyles } from "@material-ui/core";
import CachedOutlinedIcon from "@material-ui/icons/CachedOutlined";
import CheckCircleOutlineIcon from "@material-ui/icons/CheckCircleOutline";
import InfoOutlinedIcon from "@material-ui/icons/InfoOutlined";
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
  const [isLoading, setLoading] = React.useState(false);
  const [name, setName] = React.useState(value);
  const [error, setError] = React.useState<CombinedError | undefined>(undefined);
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
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    }
  };

  return (
    <Box position="relative">
      <Box
        position="absolute"
        right={14}
        width={35}
        height="100%"
        display="flex"
        flexDirection="column"
        justifyContent="center"
      >
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
    </Box>
  );
};
