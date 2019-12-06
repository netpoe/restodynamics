import gql from "graphql-tag";

export const QueryComponents = gql`
  query QueryComponents ($where: ComponentWhereInput) {
  components (where: $where) {
    id
    quantity
    unit {
      symbol
    }
    stockUnitID
    stockUnit {
      id
      name
    }
  }
}
`;
