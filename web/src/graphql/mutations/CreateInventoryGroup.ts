import gql from "graphql-tag";

export const CreateInventoryGroup = gql`
  mutation CreateInventoryGroup {
    createInventoryGroup(data: {}) {
      id
      createdAt
    }
  }
`;
