import { Box, Paper, TextField, Theme, withStyles } from "@material-ui/core";
import CachedOutlinedIcon from "@material-ui/icons/CachedOutlined";
import CheckCircleOutlineIcon from "@material-ui/icons/CheckCircleOutline";
import InfoOutlinedIcon from "@material-ui/icons/InfoOutlined";
import React from "react";
import { CombinedError, useMutation } from "urql";
import { UpsertStockUnit } from "../../../graphql/mutations";

export const StockUnitNameField = withStyles((theme: Theme) => ({
  paper: {
    position: "relative",
    padding: theme.spacing(2),
  },
  textField: {
    "& input": {
      ...theme.typography.h5,
      fontWeight: 500,
      textTransform: "capitalize",
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
  const [mutation, executeMutation] = useMutation(UpsertStockUnit);

  React.useEffect(() => {
    setName(value);
  }, [value]);

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
