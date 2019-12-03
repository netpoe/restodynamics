import gql from "graphql-tag";

export const QueryStockUnits = gql`
  query StockUnit {
    stockUnits(
      where: {
        inventory_some: { quantity_gt: "0", createdAt_gte: "2019-12-01" }
        expenseUnit_some: { createdAt_gte: "2019-12-01" }
      }
    ) {
      id
      name
      category {
        name
      }
      inventory {
        id
        quantity
        createdAt
        unit {
          name
          symbol
        }
      }
    }
  }
`;
