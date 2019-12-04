import gql from "graphql-tag";

export const QueryInventoryGroup = gql`
  query InventoryGroup($where: InventoryGroupWhereUniqueInput!) {
    inventoryGroup(where: $where) {
      id
      createdAt
      inventory {
        expenseUnit {
          amount
          currency {
            symbol
          }
        }
        quantity
        unit {
          symbol
        }
        stockUnit {
          name
        }
      }
    }
  }
`;
