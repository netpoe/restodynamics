import gql from "graphql-tag";

export const QueryStockUnits = gql`
  query QueryStockUnits($where: StockUnitWhereInput) {
    stockUnits(where: $where, orderBy: name_ASC) {
      id
      name
      category {
        name
      }
      inventoryUnits {
        id
        quantity
        createdAt
        unit {
          name
          symbol
        }
      }
    }
  }
`;
