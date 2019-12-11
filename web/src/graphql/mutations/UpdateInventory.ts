import gql from "graphql-tag";

export const UpdateInventory = gql`
  mutation UpdateInventory($where: InventoryWhereUniqueInput!, $data: InventoryUpdateInput!) {
    updateInventory(where: $where, data: $data) {
      id
      createdAt
      inventoryUnits {
        id
        stockUnit {
          name
        }
      }
    }
  }
`;
