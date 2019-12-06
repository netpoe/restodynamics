import gql from "graphql-tag";

export const CreateComponent = gql`
  mutation CreateComponent ($data: ComponentCreateInput!) {
  createComponent (data: $data) {
    id
    quantity
    stockUnit {
      id
      name
    }
  }
}
`;
