import gql from "graphql-tag";

export const QueryComponents = gql`
  query QueryComponents($where: ComponentWhereInput) {
    components(where: $where) {
      id
      stockUnit {
        id
        name
      }
      inventoryUnit {
        quantity
        unit {
          symbol
        }
        expenseUnit {
          amount
          currency {
            symbol
          }
        }
        stockUnit {
          id
          name
        }
      }
    }
  }
`;
