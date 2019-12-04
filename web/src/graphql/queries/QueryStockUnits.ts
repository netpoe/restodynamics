import gql from "graphql-tag";

export const QueryStockUnits = gql`
  query StockUnit ($where: StockUnitWhereInput) {
    stockUnits (where: $where, orderBy: name_ASC) {
      id
      name
      category {
        name
      }
      inventory {
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
