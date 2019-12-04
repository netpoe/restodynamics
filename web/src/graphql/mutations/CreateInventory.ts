import gql from "graphql-tag";

export const CreateInventory = gql`
  mutation CreateInventory($data: InventoryCreateInput!) {
    createInventory(data: $data) {
      id
      createdAt
      stockUnit {
        name
        inventory {
          id
          createdAt
        }
      }
    }
  }
`;
