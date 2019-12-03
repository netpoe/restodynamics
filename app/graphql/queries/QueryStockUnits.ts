import gql from "graphql-tag";

export const QueryStockUnits = gql`
  query StockUnit {
    stockUnits(where: { inventory: { quantity_gte: "1" } }) {
      id
      name
      category {
        name
      }
      inventory {
        id
        quantity
        unit {
          name
          symbol
        }
      }
    }
  }
`;
