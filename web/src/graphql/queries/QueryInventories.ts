import gql from "graphql-tag";

export const QueryInventories = gql`
  query QueryInventories($where: InventoryWhereInput) {
    inventories(where: $where, orderBy: createdAt_DESC) {
      id
      createdAt
      inventoryUnits {
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
