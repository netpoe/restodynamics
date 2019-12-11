import { Theme } from "@material-ui/core";

export const styles = (theme: Theme) => ({
  stockUnitInputBase: {
    "& input::placeholder": {
      opacity: 1,
    },
  },
  appBar: {
    marginBottom: theme.spacing(3),
    [theme.breakpoints.down("sm")]: {},
  },
  toolbar: {
    justifyContent: "space-between",
    [theme.breakpoints.down("sm")]: {},
  },
});