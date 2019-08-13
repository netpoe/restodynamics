import gql from "graphql-tag";

export const QueryStockUnits = gql`
  query {
    stockUnits {
      id
      name
      stockUnitCategory {
        id
        name
      }
    }
  }
`;

export const QueryStockUnit = gql`
  query QueryStockUnit($where: StockUnitWhereUniqueInput!) {
    stockUnit(where: $where) {
      id
      name
    }
  }
`;
