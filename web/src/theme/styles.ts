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
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  stockUnitsList: {
    backgroundColor: theme.palette.background.default,
    minHeight: 140,
    paddingRight: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },
  chip: {
    marginTop: theme.spacing(1),
    marginLeft: theme.spacing(1),
  },
});