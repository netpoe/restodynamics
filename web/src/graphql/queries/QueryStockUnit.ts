import gql from "graphql-tag";

export const QueryStockUnit = gql`
  query StockUnit($where: StockUnitWhereUniqueInput!) {
    stockUnit(where: $where) {
      id
      name
      category {
        name
      }
      expenseUnit {
        id
        amount
        createdAt
        currency {
          symbol
        }
      }
      inventoryUnit {
        id
        quantity
        expiresAt
        createdAt
        unit {
          name
          symbol
        }
      }
      components {
        quantity
        unit {
          symbol
        }
        stockUnit {
          id
          name
          category {
            id
            name
          }
        }
      }
    }
  }
`;
