import gql from "graphql-tag";

export const AddStockUnitToInventory = gql`
  mutation AddStockUnitToInventory($data: InventoryCreateInput!) {
    createInventory(data: $data) {
      id
      quantity
      createdAt
      updatedAt
      unit {
        name
        symbol
      }
      stockUnit {
        name
        category {
          name
        }
        expenseUnit {
          amount
          createdAt
          currency {
            symbol
          }
        }
      }
    }
  }
`;
