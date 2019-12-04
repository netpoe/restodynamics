import gql from "graphql-tag";

export const QueryStockUnitRelationships = gql`
  query StockUnitRelationships {
  stockUnitCategories {
    id
    name
  }
  measurementUnits {
    id
    symbol
    name
  }
  currencies {
    id
    symbol
  }
}
`;
