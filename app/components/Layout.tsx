import { CssBaseline } from "@material-ui/core";
import { ThemeProvider } from "@material-ui/styles";
import { withUrqlClient } from "next-urql";
import Head from "next/head";
import * as React from "react";
import { theme } from "../theme";

type Props = {
  title?: string;
  header?: React.ReactChild;
};

export const Layout = withUrqlClient({ url: "http://116.203.108.46:4466/" })(
  ({ children, title = "Resto Dynamics", header }) => (
    <div>
      <Head>
        <title>{title}</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <link
          href="https://fonts.googleapis.com/css?family=Montserrat:400,700,900&display=swap"
          rel="stylesheet"
        ></link>
      </Head>
      <CssBaseline />
      <ThemeProvider theme={theme}>
        <div style={{ display: "flex" }}>
          {header && header}
          {children}
        </div>
      </ThemeProvider>
    </div>
  ),
) as React.FC<Props>;

export default Layout;
