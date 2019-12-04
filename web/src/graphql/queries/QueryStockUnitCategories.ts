import gql from "graphql-tag";

export const QueryStockUnitCategories = gql`
  query StockUnitCategories {
    stockUnitCategories {
      id
      name
    }
  }
`;
