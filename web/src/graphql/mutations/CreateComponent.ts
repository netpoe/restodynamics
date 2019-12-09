import gql from "graphql-tag";

export const CreateComponent = gql`
  mutation CreateComponent($data: ComponentCreateInput!) {
    createComponent(data: $data) {
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
