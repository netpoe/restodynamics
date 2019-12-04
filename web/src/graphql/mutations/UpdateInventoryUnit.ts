import gql from "graphql-tag";

export const UpdateInventoryUnit = gql`
  mutation UpdateInventoryUnit(
    $where: InventoryUnitWhereUniqueInput!
    $data: InventoryUnitUpdateInput!
  ) {
    updateInventoryUnit(where: $where, data: $data) {
      id
      stockUnit {
        name
      }
    }
  }
`;
