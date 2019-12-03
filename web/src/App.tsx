import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { createClient, Provider } from "urql";
import { InventoryIndex, InventoryOverview } from "./views/inventory";
import { routes } from "./views/routes";
import { StockUnitIndex, StockUnitOverview } from "./views/stock";

const client = createClient({
  url: "http://116.203.108.46:4466/",
});

const App: React.FC = () => (
  <Provider value={client}>
    <Router>
      <Route path={routes.stock.index} component={StockUnitIndex} />
      <Route path={`${routes.stock.overview}/:id?`} component={StockUnitOverview} />
      <Route path={routes.inventory.index} component={InventoryIndex} />
      <Route path={`${routes.inventory.overview}/:id?`} component={InventoryOverview} />
    </Router>
  </Provider>
);

export default App;
