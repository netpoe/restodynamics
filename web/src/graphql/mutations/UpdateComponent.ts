import gql from "graphql-tag";

export const UpdateComponent = gql`
  mutation UpdateComponent($where: ComponentWhereUniqueInput!, $data: ComponentUpdateInput!) {
    updateComponent(where: $where, data: $data) {
      id
    }
  }
`;
