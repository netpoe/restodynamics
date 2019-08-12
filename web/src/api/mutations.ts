import gql from "graphql-tag";

export const UpsertStockUnit = gql`
  mutation ($name: String!) {
    createStockUnit(
      where: {
        name: $name
      }
      create: {
        name: $name
      }
      update: {
        name: $name
      }
    }) {
      id
      name
    }
  }
`;
