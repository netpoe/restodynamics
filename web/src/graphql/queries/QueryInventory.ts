import gql from "graphql-tag";

export const QueryInventory = gql`
  query Inventory($where: InventoryWhereUniqueInput!) {
    inventory(where: $where) {
      id
      createdAt
      inventoryUnits {
        id
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
