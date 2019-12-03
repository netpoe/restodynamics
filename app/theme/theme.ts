import { createMuiTheme } from "@material-ui/core/styles";
import { darken, lighten } from "polished";

export const spacingUnit = 16;

export const palette = {
  pink: {
    main: "#ff40b4",
    light: lighten(0.05, "#ff40b4"),
    dark: darken(0.05, "#ff40b4"),
  },
};

export const theme = createMuiTheme({
  spacing: 8,
  palette: {
    type: "dark",
    action: {
      active: "#434343",
    },
    background: {
      default: "#fff",
    },
    primary: {
      light: lighten(0.05, "#3F2F90"),
      main: "#3F2F90",
      dark: darken(0.05, "#3F2F90"),
    },
    secondary: {
      light: lighten(0.05, "#ffffff"),
      main: "#ffffff",
      dark: darken(0.05, "#ffffff"),
    },
  },
  typography: {
    fontFamily: "Montserrat, sans-serif",
    subtitle2: {
      fontSize: "1.1rem",
    },
  },
});

export default theme;
