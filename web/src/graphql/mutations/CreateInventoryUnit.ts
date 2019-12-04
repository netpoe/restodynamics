import gql from "graphql-tag";

export const CreateInventoryUnit = gql`
  mutation CreateInventoryUnit($data: InventoryUnitCreateInput!) {
    createInventoryUnit(data: $data) {
      id
      createdAt
      stockUnit {
        name
        inventoryUnit {
          id
          createdAt
        }
      }
    }
  }
`;
