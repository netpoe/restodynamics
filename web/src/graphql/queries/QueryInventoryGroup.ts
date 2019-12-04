import gql from "graphql-tag";

export const QueryInventory = gql`
  query Inventory($where: InventoryWhereUniqueInput!) {
    inventory(where: $where) {
      id
      createdAt
      inventoryUnit {
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
