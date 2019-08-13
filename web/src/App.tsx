import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { createClient, Provider } from "urql";
import { routes } from "./views/routes";
import { StockUnitIndex, StockUnitOverview } from "./views/stock";

const client = createClient({
  url: "http://localhost:4466/",
});

const App: React.FC = () => (
  <Provider value={client}>
    <Router>
      <Route path={routes.stock.index} exact component={StockUnitIndex} />
      <Route path={`${routes.stock.overview}/:id?`} exact component={StockUnitOverview} />
    </Router>
  </Provider>
);

export default App;
