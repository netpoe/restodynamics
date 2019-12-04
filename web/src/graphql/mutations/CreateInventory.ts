import gql from "graphql-tag";

export const CreateInventory = gql`
  mutation CreateInventory {
    createInventory(data: {}) {
      id
      createdAt
    }
  }
`;
