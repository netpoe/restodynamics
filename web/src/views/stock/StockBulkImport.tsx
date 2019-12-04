import { AppBar, Box, Button, Container, Grid, Theme, Toolbar, Typography, withStyles } from "@material-ui/core";
import { History } from "history";
import { get } from "lodash";
import Papa from "papaparse";
import React from "react";
import { Mention, MentionItem, MentionsInput, OnChangeHandlerFunc } from "react-mentions";
import { Link } from "react-router-dom";
import { useMutation, useQuery } from "urql";
import { Breadcrumbs, DashboardNavigationDrawer, ToolbarPadding } from "../../components";
import { UpsertStockUnit } from "../../graphql/mutations";
import { QueryStockUnitRelationships } from "../../graphql/queries";
import { routes } from "../routes";

const mentionInputStyles = {
  control: {
    backgroundColor: "#fff",
    fontSize: 14,
    fontWeight: "normal",
  },

  highlighter: {
    overflow: "hidden",
  },

  input: {
    margin: 0,
  },

  "&multiLine": {
    control: {
      // fontFamily: 'monospace',
      // border: '1px solid silver',
    },

    highlighter: {
      padding: 9,
    },

    input: {
      padding: 9,
      minHeight: 63,
      outline: 0,
      border: 0,
    },
  },

  suggestions: {
    list: {
      backgroundColor: "white",
      border: "1px solid rgba(0,0,0,0.15)",
      fontSize: 14,
    },

    item: {
      padding: "5px 15px",
      borderBottom: "1px solid rgba(0,0,0,0.15)",
      "&focused": {
        backgroundColor: "#cee4e5",
      },
    },
  },
};

export const StockBulkImport = withStyles((theme: Theme) => ({
  content: {
    flexGrow: 1,
  },
  appBar: {
    marginBottom: theme.spacing(3),
    [theme.breakpoints.down("sm")]: {},
  },
  toolbar: {
    justifyContent: "space-between",
    [theme.breakpoints.down("sm")]: {},
  },
}))(({ classes, history }: { classes: any; history: History }) => {
  const [values, setValues] = React.useState("");
  const [stockUnits, setStockUnits] = React.useState<string[][]>([[]]);
  const [stockUnitRelationshipsQuery] = useQuery({
    query: QueryStockUnitRelationships,
  });
  const [upsertStockUnitMutation, executeUpsertStockUnitMutation] = useMutation(UpsertStockUnit);

  const onChange: OnChangeHandlerFunc = (
    e,
    newValue: string,
    newPlainTextValue: string,
    mentions: MentionItem[],
  ) => {
    setValues(e.target.value);
    console.log(Papa.parse(newPlainTextValue, { header: false }));
    const { data } = Papa.parse(newValue, { header: false });
    const cleanData = data.map((d: string[]) =>
      d.map((s: string) => {
        const value = s.trim();
        const match = /\(([^)]+)\)/g.exec(value);
        return Boolean(match) ? (match as string[])[1] : value.toLowerCase();
      }),
    );
    console.log(cleanData);
    setStockUnits(cleanData);
  };

  const onCreateInventory = async () => {
    const upsert = ([name, id]: [string, string]) => new Promise(async (resolve, reject) => {
      const { data, error: mutationError } = await executeUpsertStockUnitMutation({
        where: {
          name,
        },
        create: {
          name,
          category: {
            connect: {
              id
            }
          }
        },
        update: {
          name,
          category: {
            connect: {
              id
            }
          }
        },
      });
      resolve(data);
    });

    try {
      const result = await Promise.all(stockUnits.map((d: string[]) => upsert(d as [string, string])));
      console.log(result);
      history.push(routes.stock.index);
    } catch (error) {
      console.error(error);
    }
  };

  const stockUnitCategories = get(stockUnitRelationshipsQuery.data, "stockUnitCategories", []);
  const currencies = get(stockUnitRelationshipsQuery.data, "currencies", []);
  const measurementUnits = get(stockUnitRelationshipsQuery.data, "measurementUnits", []);

  return (
    <Box display="flex">
      <DashboardNavigationDrawer history={history} />
      <Box minHeight="100vh" bgcolor="default" className={classes.content}>
        <ToolbarPadding />
        <Container maxWidth="xl">
          <AppBar className={classes.appBar} elevation={0} position="relative" color="default">
            <Toolbar className={classes.toolbar} disableGutters>
              <Breadcrumbs>
                <Link color="inherit" to={routes.stock.index}>
                  Inicio
                </Link>
                <Typography color="textPrimary">Stock</Typography>
                <Typography color="textPrimary">Importar</Typography>
              </Breadcrumbs>
              <Box>
                <Grid container spacing={2}>
                  <Grid item>
                    <Button size="large" variant="contained" color="primary" onClick={() => onCreateInventory()}>
                      Importar
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </Toolbar>
          </AppBar>
          {stockUnitRelationshipsQuery.fetching ? (
            <Typography>Cargando</Typography>
          ) : stockUnitRelationshipsQuery.error || stockUnitRelationshipsQuery.data == null ? (
            <Typography>Error</Typography>
          ) : (
            <Box>
              <Typography gutterBottom>nombre, @categoría</Typography>
              <MentionsInput
                value={values}
                onChange={onChange}
                style={mentionInputStyles}
              >
                <Mention
                  trigger="@"
                  data={() =>
                    stockUnitCategories.map((category: any) => ({
                      id: category.id,
                      display: category.name,
                    }))
                  }
                  style={{ backgroundColor: "#566DCC" }}
                  // renderSuggestion={(suggestion, search, highlightedDisplay, index, focused) => (
                  //   <div>{highlightedDisplay}</div>
                  // )}
                />
                <Mention
                  trigger="#"
                  data={() =>
                    measurementUnits.map((unit: any) => ({ id: unit.id, display: unit.symbol }))
                  }
                  style={{ backgroundColor: "#D5866F" }}
                  // renderSuggestion={(suggestion, search, highlightedDisplay, index, focused) => (
                  //   <div>{highlightedDisplay}</div>
                  // )}
                />
                <Mention
                  trigger="+"
                  data={() =>
                    currencies.map((currency: any) => ({
                      id: currency.id,
                      display: currency.symbol,
                    }))
                  }
                  style={{ backgroundColor: "#659931" }}
                  // renderSuggestion={(suggestion, search, highlightedDisplay, index, focused) => (
                  //   <div>{highlightedDisplay}</div>
                  // )}
                />
              </MentionsInput>
            </Box>
          )}
        </Container>
      </Box>
    </Box>
  );
});
