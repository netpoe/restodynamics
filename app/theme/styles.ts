import { createStyles } from "@material-ui/core";
import { theme } from "./theme";

export const styles = createStyles({
  selectChainPlaceholderBox: {
    padding: theme.spacing(2),
    minHeight: 240,
    border: `2px solid ${theme.palette.primary.dark}`,
    borderRadius: 7,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
});
