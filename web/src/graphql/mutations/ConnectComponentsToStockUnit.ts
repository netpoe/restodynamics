import gql from "graphql-tag";

export const ConnectComponentsToStockUnit = gql`
  mutation ConnectComponentsToStockUnit(
    $data: StockUnitUpdateInput!
    $where: StockUnitWhereUniqueInput!
  ) {
    updateStockUnit(data: $data, where: $where) {
      id
      name
      components {
        id
        quantity
        stockUnit {
          id
          name
        }
      }
    }
  }
`;
