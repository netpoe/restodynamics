import gql from "graphql-tag";

export const QueryInventories = gql`
  query Inventories($where: InventoryWhereInput!) {
    inventories(where: $where) {
      id
      createdAt
      quantity
      unit {
        symbol
      }
      stockUnit {
        name
      }
    }
  }
`;
