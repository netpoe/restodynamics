import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { createClient, Provider } from "urql";
import { routes } from "./views/routes";
import { StockUnitDetails, StockUnitIndex } from "./views/stock";

const client = createClient({
  url: "http://localhost:4466/",
});

const App: React.FC = () => (
  <Provider value={client}>
    <Router>
      <Route path={routes.stock.index} exact component={StockUnitIndex} />
      <Route path={`${routes.stock.details}/:id?`} exact component={StockUnitDetails} />
    </Router>
  </Provider>
);

export default App;
